'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Checkbox, InputNumber, message, Spin, Empty } from 'antd';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
import { serviceApi } from '@/api/service';
import type { IService } from '@/models/service';
import { getUrlFromFileId } from '@/utils/get-url-from-file-id';

interface ServiceSelection {
  service: IService;
  quantity: number;
  selected: boolean;
}

interface DichVuProps {
  onServiceChange?: (selectedServices: Array<{ serviceId: string; quantity: number; price: number }>) => void;
}

export const ServiceComponent = ({ onServiceChange }: DichVuProps) => {
  const [services, setServices] = useState<IService[]>([]);
  const [selectedServices, setSelectedServices] = useState<Map<string, ServiceSelection>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await serviceApi.get();
      setServices(data.filter(s => s.available !== false));
    } catch (error) {
      console.error('Error loading services:', error);
      message.error('Không thể tải danh sách dịch vụ');
    } finally {
      setLoading(false);
    }
  };

  const handleServiceToggle = (service: IService, checked: boolean) => {
    const newSelected = new Map(selectedServices);

    if (checked) {
      newSelected.set(service.id, {
        service,
        quantity: 1,
        selected: true,
      });
    } else {
      newSelected.delete(service.id);
    }

    setSelectedServices(newSelected);
    notifyChange(newSelected);
  };

  const handleQuantityChange = (service: IService, quantity: number) => {
    const newSelected = new Map(selectedServices);
    if (!newSelected.has(service.id) && quantity > 0) {

      newSelected.set(service.id, {
        service,
        quantity: 1,
        selected: true,
      });
    }
    if (quantity === 0) {
      newSelected.delete(service.id);
      setSelectedServices(newSelected);
      notifyChange(newSelected);
      return;
    }

    const current = newSelected.get(service.id);

    if (current && quantity > 0) {
      newSelected.set(service.id, {
        ...current,
        quantity,
      });
      setSelectedServices(newSelected);
      notifyChange(newSelected);
    }
  };

  const notifyChange = (selected: Map<string, ServiceSelection>) => {
    if (onServiceChange) {
      const result = Array.from(selected.values()).map(item => ({
        serviceId: item.service.id,
        quantity: item.quantity,
        price: calculateServicePrice(item.service.price) * item.quantity,
      }));
      onServiceChange(result);
    }
  };

  const calculateServicePrice = (price: number | string): number => {
    return typeof price === 'string' ? parseFloat(price) : price;
  };

  const getTotalPrice = (): number => {
    return Array.from(selectedServices.values()).reduce((total, item) => {
      return total + (calculateServicePrice(item.service.price) * item.quantity);
    }, 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spin size="large" />
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <Empty
        description="Chưa có dịch vụ nào"
        className="py-12"
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <h2>Dịch vụ</h2>

      <div className="grid lg:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-auto">
        {services.map((service) => {
          const isSelected = selectedServices.has(service.id);
          const selection = selectedServices.get(service.id);
          const quantity = selection?.quantity || 0;
          const price = calculateServicePrice(service.price);

          return (
            <div className='flex bg-white' key={service.id}>
              <div className='w-1/2 p-2 max-w-1/2 max-h-full  flex items-center justify-center rounded-lg overflow-hidden'>
                {
                  service.imageId ? (
                    <img
                      alt={service.name}
                      src={getUrlFromFileId(service.imageId)}
                      className="max-w-full max-h-full object-cover"
                    />
                  ) : (
                    <div className="h-72 bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-400 text-4xl">🛎️</span>
                    </div>
                  )
                }
              </div>
              <div className='w-1/2 p-2 flex flex-col'>
                <h3 className="font-semibold text-lg">{service.name}</h3>
                {service.description && (
                  <p className="text-gray-600 text-sm mt-1">{service.description}</p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-pink-600 font-bold text-lg">
                    {price.toLocaleString('vi-VN')}đ
                  </span>
                  {service.unit && (
                    <span className="text-gray-500 text-sm">/ {service.unit}</span>
                  )}
                </div>
                <div className=''>
                  <InputNumber
                    min={0}
                    max={99}
                    value={quantity}
                    onChange={(val) => handleQuantityChange(service, val || 0)}
                    className="w-16"
                    size="small"
                  />
                </div>
              </div>
            </div>
          )

          // return (
          //   <Card
          //     key={service.id}
          //     hoverable
          //     className={`transition-all ${isSelected ? 'ring-2 ring-pink-500' : ''}`}
          //     cover={
          //       service.imageId ? (
          //         <img
          //           alt={service.name}
          //           src={getUrlFromFileId(service.imageId)}
          //           className="h-72 object-cover"
          //         />
          //       ) : (
          //         <div className="h-72 bg-gray-200 flex items-center justify-center">
          //           <span className="text-gray-400 text-4xl">🛎️</span>
          //         </div>
          //       )
          //     }
          //   >
          //     <div className="flex flex-col gap-3">
          //       {/* Service Header */}
          //       <div className="flex justify-between items-start">
          //         <div className="flex-1">
          //           <h3 className="font-semibold text-lg">{service.name}</h3>
          //           {service.description && (
          //             <p className="text-gray-600 text-sm mt-1">{service.description}</p>
          //           )}
          //         </div>
          //         <Checkbox
          //           checked={isSelected}
          //           onChange={(e) => handleServiceToggle(service, e.target.checked)}
          //         />
          //       </div>

          //       {/* Price */}
          //       <div className="flex items-center gap-2">
          //         <span className="text-pink-600 font-bold text-lg">
          //           {price.toLocaleString('vi-VN')}đ
          //         </span>
          //         {service.unit && (
          //           <span className="text-gray-500 text-sm">/ {service.unit}</span>
          //         )}
          //       </div>

          //       {/* Quantity Controls */}
          //       {isSelected && (
          //         <div className="flex items-center gap-2 pt-2 border-t">
          //           <span className="text-sm text-gray-600">Số lượng:</span>
          //           <div className="flex items-center gap-2 ml-auto">
          //             <Button
          //               size="small"
          //               icon={<MinusOutlined />}
          //               onClick={() => handleDecrement(service.id)}
          //               disabled={quantity <= 1}
          //             />
          //             <InputNumber
          //               min={1}
          //               max={99}
          //               value={quantity}
          //               onChange={(val) => handleQuantityChange(service.id, val || 1)}
          //               className="w-16"
          //               size="small"
          //             />
          //             <Button
          //               size="small"
          //               icon={<PlusOutlined />}
          //               onClick={() => handleIncrement(service.id)}
          //               disabled={quantity >= 99}
          //             />
          //           </div>
          //         </div>
          //       )}

          //       {/* Subtotal */}
          //       {isSelected && (
          //         <div className="flex justify-between items-center pt-2 border-t">
          //           <span className="text-sm font-medium">Thành tiền:</span>
          //           <span className="font-semibold text-pink-600">
          //             {(price * quantity).toLocaleString('vi-VN')}đ
          //           </span>
          //         </div>
          //       )}
          //     </div>
          //   </Card>
          // );
        })}
      </div>

      {/* Total Summary */}
      {selectedServices.size > 0 && (
        <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-lg font-semibold">Tổng tiền dịch vụ:</span>
              <span className="text-sm text-gray-600 ml-2">
                ({selectedServices.size} dịch vụ)
              </span>
            </div>
            <span className="text-2xl font-bold text-pink-600">
              {getTotalPrice().toLocaleString('vi-VN')}đ
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceComponent;
