import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import {
  MapPin,
  ArrowLeft,
  Phone,
  Mail,
  Building,
  Ruler,
  DollarSign,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  TrendingUp
} from 'lucide-react';
import PropertyMap from '../components/PropertyMap';
import { useProperties } from '../hooks/use-properties';
import { API_URL } from '../lib/api';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const { properties, loading, error } = useProperties();
  const property = properties.find(p => p._id === id || p.id === parseInt(id));
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [stats, setStats] = useState({
    views: 0,
    contactRequests: 0
  });

  // Increment views when page loads
  useEffect(() => {
    if (property && property._id) {
      fetch(`${API_URL}/property/view/${property._id}`, {
        method: 'POST'
      })
      .then(response => response.json())
      .then(data => {
        setStats(prev => ({ ...prev, views: data.views }));
      })
      .catch(err => {
        console.error('Failed to increment views:', err);
      });
    }
  }, [property]);

  if (loading) return <div className="text-center py-12">Загрузка...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;
  if (!property) {
    return (
      <div className="min-h-screen py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Объект не найден</h1>
          <p className="text-gray-600 mb-8">Объект, который вы ищете, не существует.</p>
          <Button asChild>
            <Link to="/">Вернуться к объектам</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    }
    return `$${price.toLocaleString()}`;
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === property.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? property.images.length - 1 : prev - 1
    );
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    
    // Increment contact requests
    if (property._id) {
      try {
        const response = await fetch(`${API_URL}/property/contact/${property._id}`, {
          method: 'POST'
        });
        const data = await response.json();
        setStats(prev => ({ ...prev, contactRequests: data.contactRequests }));
      } catch (err) {
        console.error('Failed to increment contact requests:', err);
      }
    }
    
    // In a real app, this would send the form data to a server
    alert('Спасибо за ваш запрос! Мы свяжемся с вами в ближайшее время.');
    setContactForm({ name: '', email: '', phone: '', message: '' });
  };

  const handleInputChange = (field, value) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  // Calculate days since creation
  const getDaysSinceCreation = () => {
    if (!property.createdAt) return 'Недавно';
    const created = new Date(property.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now - created);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return '1 день назад';
    if (diffDays < 7) return `${diffDays} дней назад`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} недель назад`;
    return `${Math.floor(diffDays / 30)} месяцев назад`;
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Вернуться к объектам
            </Link>
          </Button>
        </div>

        {/* Property Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {property.title}
              </h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-5 w-5 mr-2" />
                <span className="text-lg">{property.address}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant={property.status === 'for-sale' ? 'default' : 'secondary'}>
                  {property.status === 'for-sale' ? 'Продажа' : 'Аренда'}
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {property.type}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl md:text-4xl font-bold text-primary">
                {formatPrice(property.price)}
                {property.status === 'for-rent' && <span className="text-lg text-gray-600">/мес</span>}
              </p>
              <p className="text-lg text-gray-600">{property.area} кв.м</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative h-96 rounded-lg overflow-hidden">
                <img
                  src={property.images[currentImageIndex]}
                  alt={`${property.title} - Изображение ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setIsGalleryOpen(true)}
                />
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {property.images.length}
                </div>
              </div>
              
              {/* Thumbnail Gallery */}
              {property.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {property.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                        index === currentImageIndex ? 'border-primary' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Миниатюра ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Описание объекта</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{property.description}</p>
              </CardContent>
            </Card>

            {/* Property Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Характеристики объекта</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Building className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Тип недвижимости</p>
                      <p className="text-gray-600 capitalize">{property.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Ruler className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Площадь</p>
                      <p className="text-gray-600">{property.area} кв.м</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Цена</p>
                      <p className="text-gray-600">
                        {formatPrice(property.price)}
                        {property.status === 'for-rent' && '/мес'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Статус</p>
                      <p className="text-gray-600">
                        {property.status === 'for-sale' ? 'Продажа' : 'Аренда'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Местоположение</p>
                      <p className="text-gray-600">{property.location}</p>
                    </div>
                  </div>
                  {property.investmentReturn && (
                    <div className="flex items-center gap-3">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">Доходность</p>
                        <p className="text-gray-600">{property.investmentReturn}</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="mt-6">
                  <p className="font-medium mb-2">Планировка</p>
                  <p className="text-gray-600">{property.layout}</p>
                </div>
              </CardContent>
            </Card>

            {/* Location Map */}
            <Card>
              <CardHeader>
                <CardTitle>Местоположение</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-gray-700 mb-2">{property.address}</p>
                  <p className="text-sm text-gray-600">{property.location}</p>
                </div>
                <PropertyMap property={property} height="400px" />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Agent Contact */}
            <Card>
              <CardHeader>
                <CardTitle>Связаться с агентом</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-left">
                  <h3 className="font-semibold text-lg">{property.agent.name}</h3>
                  <p className="text-gray-600">Специалист по недвижимости</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-primary" />
                    <span className="text-gray-700">{property.agent.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="text-gray-700">{property.agent.email}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1" size="sm">
                    <Phone className="mr-2 h-4 w-4" />
                    Позвонить
                  </Button>
                  <Button variant="outline" className="flex-1" size="sm">
                    <Mail className="mr-2 h-4 w-4" />
                    Написать
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle>Отправить запрос</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <Input
                    placeholder="Ваше имя"
                    value={contactForm.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Ваш Email"
                    value={contactForm.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    required
                  />
                  <Input
                    type="tel"
                    placeholder="Ваш телефон"
                    value={contactForm.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                  <Textarea
                    placeholder="Ваше сообщение"
                    value={contactForm.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    rows={4}
                    required
                  />
                  <Button type="submit" className="w-full">
                    Отправить запрос
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Краткая статистика</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Размещено</span>
                  <span className="font-medium">{getDaysSinceCreation()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Просмотры</span>
                  <span className="font-medium">{stats.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Запросы</span>
                  <span className="font-medium">{stats.contactRequests}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Full Screen Gallery Modal */}
        {isGalleryOpen && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
            <button
              onClick={() => setIsGalleryOpen(false)}
              className="absolute top-4 right-4 text-white p-2 hover:bg-white/20 rounded-full transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="relative max-w-4xl max-h-full">
              <img
                src={property.images[currentImageIndex]}
                alt={`${property.title} - Изображение ${currentImageIndex + 1}`}
                className="max-w-full max-h-full object-contain"
              />
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white p-3 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <ChevronLeft className="h-8 w-8" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white p-3 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <ChevronRight className="h-8 w-8" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyDetailPage; 

