import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { filterOptions } from '../data/properties';
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '../components/ui/alert-dialog';
import { API_URL } from '../lib/api';

const AdminPage = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const [newProperty, setNewProperty] = useState({
    title: '',
    type: '',
    status: '',
    price: '',
    area: '',
    location: '',
    address: '',
    layout: '',
    description: '',
    images: [],
    coordinates: [],
    agent: { name: '', phone: '', email: '' },
    isFeatured: false,
    investmentReturn: ''
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageLimitError, setImageLimitError] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState(null);
  const [sortBy, setSortBy] = useState('recently-modified');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    localStorage.removeItem('adminLoginData');
    navigate('/');
  };

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/properties`)
      .then(res => res.json())
      .then(data => {
        setProperties(data);
        setLoading(false);
      })
      .catch(() => {
        setFetchError('Ошибка загрузки данных');
        setLoading(false);
      });
  }, []);

  const handleAddOrEditProperty = async (e) => {
    e.preventDefault();
    const method = editMode ? 'PUT' : 'POST';
    const url = editMode ? `${API_URL}/properties/${editId}` : `${API_URL}/properties`;
    
    // Include uploaded images in the property data and convert numeric fields
    const propertyData = {
      ...newProperty,
      price: parseFloat(newProperty.price) || 0,
      area: parseFloat(newProperty.area) || 0,
      coordinates: newProperty.coordinates.length > 0 ? newProperty.coordinates.map(coord => parseFloat(coord)).filter(coord => !isNaN(coord)) : [],
      images: uploadedImages
    };
    
    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const property = await response.json();
      
      if (editMode) {
        setProperties(prev => prev.map(p => (p._id === editId ? property : p)));
      } else {
        setProperties(prev => [property, ...prev]);
      }
      
      handleCancelEdit();
    } catch (error) {
      alert(error.message || 'Ошибка сохранения');
    }
  };

  const handleEditProperty = (property) => {
    setEditMode(true);
    setEditId(property._id);
    setNewProperty({
      ...property,
      price: property.price.toString(),
      area: property.area.toString(),
      coordinates: property.coordinates ? property.coordinates.map(String) : [],
      images: [], // don't prefill images, user can re-upload if needed
    });
    setUploadedImages(property.images || []);
    setImagePreviews([]);
    setImageLimitError('');
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditId(null);
    setNewProperty({
      title: '',
      type: '',
      status: '',
      price: '',
      area: '',
      location: '',
      address: '',
      layout: '',
      description: '',
      images: [],
      coordinates: [],
      agent: { name: '', phone: '', email: '' },
      isFeatured: false,
      investmentReturn: ''
    });
    setImagePreviews([]);
    setUploadedImages([]);
    setImageLimitError('');
  };

  const handlePropertyChange = (field, value) => {
    setNewProperty(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAgentChange = (field, value) => {
    setNewProperty(prev => ({
      ...prev,
      agent: { ...prev.agent, [field]: value }
    }));
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    if (files.length + uploadedImages.length + imagePreviews.length > 10) {
      setImageLimitError('Максимум 10 изображений на объект.');
      return;
    }
    setImageLimitError('');
    Promise.all(files.map(file => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    })).then(imagesDataUrls => {
      setImagePreviews(prev => [...prev, ...imagesDataUrls].slice(0, 10 - uploadedImages.length));
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (uploadedImages.length + imagePreviews.length >= 10) return;
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    handleFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleRemovePreviewImage = (idx) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== idx));
  };

  const handleRemoveUploadedImage = (idx) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUploadImages = async () => {
    if (imagePreviews.length + uploadedImages.length > 10) {
      setImageLimitError('Максимум 10 изображений на объект.');
      return;
    }

    // Convert base64 previews back to files for upload
    const files = [];
    for (let i = 0; i < imagePreviews.length; i++) {
      const base64 = imagePreviews[i];
      const response = await fetch(base64);
      const blob = await response.blob();
      const file = new File([blob], `image-${i}.jpg`, { type: 'image/jpeg' });
      files.push(file);
    }

    if (files.length === 0) {
      setImageLimitError('Нет изображений для загрузки.');
      return;
    }

    const formData = new FormData();
    files.forEach(file => {
      formData.append('images', file);
    });

    try {
      const data = await fetch(`${API_URL}/uploadImages`, {
        method: 'POST',
        body: formData
      });
      
      setUploadedImages(prev => [...prev, ...data.imageUrls].slice(0, 10));
      setImagePreviews([]);
      setImageLimitError('');
    } catch (error) {
      setImageLimitError(error.message || 'Ошибка загрузки изображений');
    }
  };

  const handleDeleteProperty = async (id) => {
    try {
      const response = await fetch(`${API_URL}/properties/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Удаляем объект из локального состояния
      setProperties(prev => prev.filter(p => p._id !== id));
    } catch (error) {
      alert('Ошибка удаления: ' + error.message);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Не указано';
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDisplayDate = (property) => {
    if (property.updatedAt && property.updatedAt !== property.createdAt) {
      return `Изменено: ${formatDate(property.updatedAt)}`;
    } else {
      return `Создано: ${formatDate(property.createdAt)}`;
    }
  };

  const handleRequestDeleteProperty = (property) => {
    setPropertyToDelete(property);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDeleteProperty = () => {
    if (propertyToDelete) {
      handleDeleteProperty(propertyToDelete._id);
      setPropertyToDelete(null);
      setDeleteDialogOpen(false);
    }
  };

  const handleCancelDeleteProperty = () => {
    setPropertyToDelete(null);
    setDeleteDialogOpen(false);
  };



  // Функция сортировки объектов
  const getSortedProperties = () => {
    const sorted = [...properties];
    
    switch (sortBy) {
      case 'recently-modified':
        return sorted.sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
      case 'recently-added':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'title-az':
        return sorted.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      case 'title-za':
        return sorted.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
      case 'price-high-low':
        return sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'price-low-high':
        return sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'area-high-low':
        return sorted.sort((a, b) => (b.area || 0) - (a.area || 0));
      case 'area-low-high':
        return sorted.sort((a, b) => (a.area || 0) - (b.area || 0));
      default:
        return sorted;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Админ-панель</h1>
        <button onClick={handleLogout} className="ml-auto bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 cursor-pointer">
          Выйти
        </button>
      </div>
        <Card className="mb-8">
          <CardHeader>
          <CardTitle>{editMode ? 'Редактировать объект' : 'Добавить объект'}</CardTitle>
          </CardHeader>
          <CardContent>
          <form onSubmit={handleAddOrEditProperty} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Заголовок</Label>
                  <Input id="title" value={newProperty.title} onChange={(e) => handlePropertyChange('title', e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="type">Тип недвижимости</Label>
                  <Select value={newProperty.type} onValueChange={(value) => handlePropertyChange('type', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите тип" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.types.filter(type => type.value !== 'all').map(type => (
                        <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Статус</Label>
                  <Select value={newProperty.status} onValueChange={(value) => handlePropertyChange('status', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите статус" />
                    </SelectTrigger>
                    <SelectContent>
                      {filterOptions.status.filter(status => status.value !== 'all').map(status => (
                        <SelectItem key={status.value} value={status.value}>{status.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="price">Цена</Label>
                  <Input id="price" type="number" value={newProperty.price} onChange={(e) => handlePropertyChange('price', e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="area">Площадь (кв.м)</Label>
                  <Input id="area" type="number" value={newProperty.area} onChange={(e) => handlePropertyChange('area', e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="location">Местоположение</Label>
                  <Input id="location" value={newProperty.location} onChange={(e) => handlePropertyChange('location', e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="address">Адрес</Label>
                  <Input id="address" value={newProperty.address} onChange={(e) => handlePropertyChange('address', e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="layout">Планировка</Label>
                  <Input id="layout" value={newProperty.layout} onChange={(e) => handlePropertyChange('layout', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="investmentReturn">Доходность (например, 'до 30% в год')</Label>
                  <Input id="investmentReturn" value={newProperty.investmentReturn} onChange={(e) => handlePropertyChange('investmentReturn', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="coordinates">Координаты (широта, долгота)</Label>
                  <Input id="coordinates" placeholder="например, 40.7128, -74.0060" value={newProperty.coordinates.join(', ')} onChange={(e) => handlePropertyChange('coordinates', e.target.value.split(',').map(s => parseFloat(s.trim())).filter(n => !isNaN(n)))} />
                </div>
              </div>
              <div>
                <Label htmlFor="description">Описание</Label>
                <Textarea id="description" value={newProperty.description} onChange={(e) => handlePropertyChange('description', e.target.value)} rows={4} required />
              </div>
              <div>
                <Label htmlFor="images">Изображения (загрузите файлы, максимум 10)</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'} ${uploadedImages.length >= 10 ? 'opacity-50 pointer-events-none' : ''}`}
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current && fileInputRef.current.click(); }}
                  aria-label="Перетащите изображения или кликните для выбора файлов"
                >
                  {uploadedImages.length + imagePreviews.length < 10 ? (
                    <span>Перетащите изображения сюда или <span className="underline text-blue-600">выберите файлы</span></span>
                  ) : (
                    <span>Достигнут лимит в 10 изображений</span>
                  )}
                  <input
                    ref={fileInputRef}
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    disabled={uploadedImages.length >= 10}
                    className="hidden"
                  />
                </div>
                {imageLimitError && <div className="text-red-500 text-sm mt-1">{imageLimitError}</div>}
                {imagePreviews.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {imagePreviews.map((src, idx) => (
                      <div key={idx} className="relative inline-block">
                        <img src={src} alt={`preview-${idx}`} className="w-20 h-20 object-cover rounded border" />
                        <button type="button" onClick={() => handleRemovePreviewImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs cursor-pointer">×</button>
                      </div>
                    ))}
                  </div>
                )}
                {imagePreviews.length > 0 && (
                  <Button type="button" className="mt-2 cursor-pointer" onClick={handleUploadImages}>Загрузить выбранные изображения</Button>
                )}
                {uploadedImages.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {uploadedImages.map((src, idx) => (
                      <div key={idx} className="relative inline-block">
                        <img src={src} alt={`uploaded-${idx}`} className="w-20 h-20 object-cover rounded border" />
                        <button type="button" onClick={() => handleRemoveUploadedImage(idx)} className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs cursor-pointer">×</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="agentName">Имя агента</Label>
                  <Input id="agentName" value={newProperty.agent.name} onChange={(e) => handleAgentChange('name', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="agentPhone">Телефон агента</Label>
                  <Input id="agentPhone" value={newProperty.agent.phone} onChange={(e) => handleAgentChange('phone', e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="agentEmail">Email агента</Label>
                  <Input id="agentEmail" type="email" value={newProperty.agent.email} onChange={(e) => handleAgentChange('email', e.target.value)} />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isFeatured"
                  checked={newProperty.isFeatured}
                  onCheckedChange={(checked) => handlePropertyChange('isFeatured', checked)}
                  className="cursor-pointer"
                />
                <Label htmlFor="isFeatured" className="cursor-pointer">Рекомендуемый объект</Label>
              </div>
              <div className="flex gap-2">
              <Button type="submit" className="cursor-pointer">{editMode ? 'Сохранить изменения' : 'Добавить'}</Button>
                {editMode && (
                  <Button type="button" variant="outline" onClick={handleCancelEdit} className="cursor-pointer">Отмена</Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Существующие объекты</CardTitle>
              <div className="flex items-center space-x-2">
                <Label htmlFor="sort">Сортировка:</Label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recently-modified">Недавно изменённые</SelectItem>
                    <SelectItem value="recently-added">Недавно добавленные</SelectItem>
                    <SelectItem value="title-az">Название А-Я</SelectItem>
                    <SelectItem value="title-za">Название Я-А</SelectItem>
                    <SelectItem value="price-high-low">Цена (высокая-низкая)</SelectItem>
                    <SelectItem value="price-low-high">Цена (низкая-высокая)</SelectItem>
                    <SelectItem value="area-high-low">Площадь (большая-маленькая)</SelectItem>
                    <SelectItem value="area-low-high">Площадь (маленькая-большая)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
          {loading ? (
            <div>Загрузка...</div>
          ) : fetchError ? (
            <div className="text-red-500">{fetchError}</div>
          ) : properties.length === 0 ? (
              <p>Нет объектов для отображения.</p>
            ) : (
              <div className="space-y-4">
              {getSortedProperties().map((property) => (
                <div key={property._id || property.id} className="border p-4 rounded-md">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-lg">{property.title}</h3>
                      <div className="flex items-center space-x-2">
                        <Button type="button" size="sm" variant="outline" onClick={() => handleEditProperty(property)} className="cursor-pointer">
                          Редактировать
                        </Button>
                        <AlertDialog open={deleteDialogOpen && propertyToDelete?._id === property._id} onOpenChange={(open) => { if (!open) handleCancelDeleteProperty(); }}>
                          <AlertDialogTrigger asChild>
                            <Button type="button" size="sm" variant="destructive" onClick={() => handleRequestDeleteProperty(property)} className="cursor-pointer">
                              Удалить
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Удалить объект?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Вы уверены, что хотите удалить этот объект? Это действие нельзя отменить.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel onClick={handleCancelDeleteProperty} className="cursor-pointer">Отмена</AlertDialogCancel>
                              <AlertDialogAction onClick={handleConfirmDeleteProperty} className="cursor-pointer">Удалить</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">{property.location} - {property.type}</p>
                      <p className="text-sm text-gray-600">Цена: {property.price} - Площадь: {property.area} кв.м</p>
                      {property.investmentReturn && (
                        <p className="text-sm text-green-600">Доходность: {property.investmentReturn}</p>
                      )}

                      <p className="text-xs text-gray-500 mt-2">
                        {getDisplayDate(property)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  );
};

export default AdminPage;


