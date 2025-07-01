import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Building2, Store, Factory, TreePine, Car, Home } from 'lucide-react';
import { properties, filterOptions } from '../data/properties';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapPage = () => {
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Filter properties based on selected filters
  const filteredProperties = properties.filter(property => {
    if (selectedType !== 'all' && property.type !== selectedType) return false;
    if (selectedStatus !== 'all' && property.status !== selectedStatus) return false;
    return true;
  });

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    }
    return `$${price.toLocaleString()}`;
  };

  const getPropertyIcon = (type) => {
    switch (type) {
      case 'нежилые помещения':
        return Building2;
      case 'жилые помещения':
        return Home;
      case 'гараж-боксы':
        return Factory;
      case 'машино-места':
        return Car;
      default:
        return MapPin;
    }
  };

  const getMarkerColor = (type) => {
    switch (type) {
      case 'нежилые помещения':
        return '#3b82f6'; // blue
      case 'жилые помещения':
        return '#10b981'; // green
      case 'гараж-боксы':
        return '#f59e0b'; // orange
      case 'машино-места':
        return '#8b5cf6'; // purple
      default:
        return '#6b7280'; // gray
    }
  };

  // Create custom marker icons for different property types
  const createCustomIcon = (type) => {
    const color = getMarkerColor(type);
    let iconText = '';
    switch (type) {
      case 'нежилые помещения':
        iconText = 'НЖ';
        break;
      case 'жилые помещения':
        iconText = 'ЖЛ';
        break;
      case 'гараж-боксы':
        iconText = 'ГБ';
        break;
      case 'машино-места':
        iconText = 'ММ';
        break;
      default:
        iconText = 'ОБ';
    }

    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
        <div style="color: white; font-size: 12px; font-weight: bold;">${iconText}</div>
      </div>`,
      className: 'custom-marker',
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  };

  // Calculate center point of all properties
  const centerLat = filteredProperties.reduce((sum, prop) => sum + prop.coordinates[0], 0) / filteredProperties.length || 40.7589;
  const centerLng = filteredProperties.reduce((sum, prop) => sum + prop.coordinates[1], 0) / filteredProperties.length || -73.9851;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Карта объектов
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Изучите {filteredProperties.length} объектов на интерактивной карте
          </p>
          
          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Тип недвижимости" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.types.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Статус" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.status.map(option => (
                  <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Map and Legend */}
      <div className="flex flex-col lg:flex-row h-screen">
        {/* Map */}
        <div className="flex-1 relative">
          <MapContainer
            center={[centerLat, centerLng]}
            zoom={12}
            style={{ height: '100%', width: '100%' }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {filteredProperties.map((property) => (
              <Marker
                key={property.id}
                position={property.coordinates}
                icon={createCustomIcon(property.type)}
              >
                <Popup className="custom-popup">
                  <div className="w-64">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <p className="text-xl font-bold text-primary">
                          {formatPrice(property.price)}
                          {property.status === 'for-rent' && <span className="text-sm text-gray-600">/мес</span>}
                        </p>
                        <p className="text-sm text-gray-600">{property.area} кв.м</p>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          property.status === 'for-sale' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {property.status === 'for-sale' ? 'Продажа' : 'Аренда'}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full capitalize">
                          {property.type}
                        </span>
                      </div>
                    </div>
                    <Button asChild size="sm" className="w-full">
                      <Link to={`/property/${property.id}`}>
                        Подробнее
                      </Link>
                    </Button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Legend and Property List */}
        <div className="lg:w-80 bg-white border-l overflow-y-auto">
          <div className="p-6">
            {/* Legend */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Легенда карты</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">НЖ</div>
                    <span className="text-sm">Нежилые помещения</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">ЖЛ</div>
                    <span className="text-sm">Жилые помещения</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">ГБ</div>
                    <span className="text-sm">Гараж-боксы</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">ММ</div>
                    <span className="text-sm">Машино-места</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Property List */}
            <div>
              <h3 className="font-semibold mb-4">Объекты ({filteredProperties.length})</h3>
              <div className="space-y-4">
                {filteredProperties.map((property) => {
                  const IconComponent = getPropertyIcon(property.type);
                  return (
                    <Card key={property.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div 
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                            style={{ backgroundColor: getMarkerColor(property.type) }}
                          >
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm mb-1 truncate">{property.title}</h4>
                            <p className="text-xs text-gray-600 mb-2">{property.location}</p>
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-semibold text-primary">
                                {formatPrice(property.price)}
                                {property.status === 'for-rent' && <span className="text-xs">/мес</span>}
                              </span>
                              <Button asChild size="sm" variant="outline">
                                <Link to={`/property/${property.id}`}>
                                  Подробнее
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;


