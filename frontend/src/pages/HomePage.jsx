import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Search, MapPin, Building2, Store, Factory, TreePine, DollarSign, TrendingUp } from 'lucide-react';
import { filterOptions } from '../data/properties';
import { useProperties } from '../hooks/use-properties';

import { API_ENDPOINTS } from '../lib/api';

const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [selectedAreaRange, setSelectedAreaRange] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedInvestmentReturn, setSelectedInvestmentReturn] = useState('all');
  const { properties, loading, error } = useProperties();

  const propertyTypes = [
    { icon: Building2, name: 'Нежилые помещения', count: '2,450+', color: 'text-blue-600' },
    { icon: Store, name: 'Жилые помещения', count: '1,890+', color: 'text-green-600' },
    { icon: Factory, name: 'Гараж-боксы', count: '1,230+', color: 'text-orange-600' },
    { icon: TreePine, name: 'Машино-места', count: '890+', color: 'text-purple-600' }
  ];

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)} млн ₽`;
    }
    return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', maximumFractionDigits: 0 }).format(price);
  };

  const filteredProperties = useMemo(() => {
    let filtered = [...properties];
    filtered.sort((a, b) => (b.isFeatured ? 1 : -1) - (a.isFeatured ? 1 : -1));
    if (searchTerm) {
      filtered = filtered.filter(property =>
        property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        property.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedType !== 'all') {
      filtered = filtered.filter(property => property.type === selectedType);
    }
    if (selectedPriceRange !== 'all') {
      const [min, max] = selectedPriceRange.split('-').map(Number);
      filtered = filtered.filter(property => {
        if (selectedPriceRange.includes('+')) {
          return property.price >= min;
        } else {
          return property.price >= min && property.price <= max;
        }
      });
    }
    if (selectedAreaRange !== 'all') {
      const [min, max] = selectedAreaRange.split('-').map(Number);
      filtered = filtered.filter(property => {
        if (selectedAreaRange.includes('+')) {
          return property.area >= min;
        } else {
          return property.area >= min && property.area <= max;
        }
      });
    }
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(property => property.status === selectedStatus);
    }
    if (selectedInvestmentReturn !== 'all') {
      const [min, max] = selectedInvestmentReturn.split('-').map(Number);
      filtered = filtered.filter(property => {
        const returnNum = parseFloat(property.investmentReturn?.replace(/[^0-9.]/g, '') || '0');
        if (selectedInvestmentReturn.includes('+')) {
          return returnNum >= min;
        } else {
          return returnNum >= min && returnNum <= max;
        }
      });
    }
    return filtered;
  }, [properties, searchTerm, selectedType, selectedPriceRange, selectedAreaRange, selectedStatus, selectedInvestmentReturn]);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedType('all');
    setSelectedPriceRange('all');
    setSelectedAreaRange('all');
    setSelectedStatus('all');
    setSelectedInvestmentReturn('all');
  };

  if (loading) return <div className="text-center py-12">Загрузка...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
        <div className="absolute inset-0 bg-black/50"></div>
        <div 
          className="relative min-h-[600px] flex items-center bg-cover bg-center"
          style={{
            backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><rect fill="%23374151" width="1200" height="600"/><polygon fill="%23111827" points="0,600 400,400 800,500 1200,300 1200,600"/></svg>')`
          }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Найдите идеальное
                <span className="text-primary block">коммерческое помещение</span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Откройте для себя премиальные офисные здания, торговые площади, промышленные объекты и земельные участки под застройку в лучших местах.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="text-lg px-8 py-6">
                  <Link to="/map">
                    <MapPin className="mr-2 h-5 w-5" />
                    Посмотреть на карте
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Types */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Типы недвижимости
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Изучите наш разнообразный портфель коммерческой недвижимости
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {propertyTypes.map((type, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6 text-center">
                  <type.icon className={`h-12 w-12 mx-auto mb-4 ${type.color} group-hover:scale-110 transition-transform`} />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{type.name}</h3>
                  <p className="text-2xl font-bold text-primary mb-1">{type.count}</p>
                  <p className="text-sm text-gray-600">Доступные объекты</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* All Properties Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Все объекты недвижимости
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Откройте для себя {filteredProperties.length} премиальных коммерческих объектов
            </p>
          </div>

          {/* Filter Properties */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Фильтровать объекты</h3>
            <div className="flex flex-wrap gap-4 items-end">
              <Input
                type="text"
                placeholder="Поиск объектов..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="min-w-[200px] flex-1"
              />
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Тип недвижимости" />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.types.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedPriceRange} onValueChange={setSelectedPriceRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Цена" />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.priceRanges.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedAreaRange} onValueChange={setSelectedAreaRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Площадь" />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.areaRanges.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Статус" />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.status.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedInvestmentReturn} onValueChange={setSelectedInvestmentReturn}>
                <SelectTrigger>
                  <SelectValue placeholder="Доходность" />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.investmentReturns.map(option => (
                    <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleClearFilters} variant="outline">
                Очистить фильтры
              </Button>
            </div>
          </div>

          {/* Property Listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {filteredProperties.map((property) => (
              <Link key={property._id || property.id} to={`/property/${property._id || property.id}`} className="block group focus:outline-none focus:ring-2 focus:ring-primary rounded-xl h-full">
                <Card className="overflow-hidden hover:shadow-xl transition-shadow group cursor-pointer pt-0 h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={`px-3 py-1 rounded-full text-xs font-medium ${
                        property.status === 'for-sale' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {property.status === 'for-sale' ? 'Продажа' : 'Аренда'}
                      </Badge>
                      {property.isFeatured && (
                        <Badge variant="secondary" className="ml-2 px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                          Рекомендуемое
                        </Badge>
                      )}
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="outline" className="capitalize">
                        {property.type}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="pt-0 px-6 pb-6 flex flex-col flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      {property.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-3">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{property.location}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {property.description}
                    </p>
                    <div className="flex justify-between items-center mb-3 mt-auto">
                      <div>
                        <p className="text-2xl font-bold text-primary">
                          {formatPrice(property.price)}
                          {property.status === 'for-rent' && <span className="text-sm text-gray-600">/мес</span>}
                        </p>
                        <p className="text-sm text-gray-600">{property.area} кв.м</p>
                      </div>
                    </div>
                    {property.investmentReturn && (
                      <div className="flex items-center text-green-600 text-sm font-medium mt-2">
                        <TrendingUp className="h-4 w-4 mr-1" />
                        <span>Доходность: {property.investmentReturn}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-600 text-lg">Нет объектов, соответствующих вашим критериям.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Готовы начать?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Наша команда экспертов готова помочь вам найти идеальное коммерческое помещение для вашего бизнеса.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary" size="lg">
              <Link to="/contact">
                Связаться с командой
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary">
              <Link to="/">
                Просмотреть объекты
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

