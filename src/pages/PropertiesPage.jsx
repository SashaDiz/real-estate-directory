import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { MapPin, Search, Filter, Grid, List } from 'lucide-react';
import { filterOptions } from '../data/properties';
import { useProperties } from '../hooks/use-properties';
import { API_URL } from '../lib/api';

const PropertiesPage = ({ status }) => {
  const [filters, setFilters] = useState({
    type: 'all',
    status: status || 'all',
    priceRange: 'all',
    areaRange: 'all',
    search: ''
  });
  const [viewMode, setViewMode] = useState('grid');
  const { properties, loading, error } = useProperties();

  // Filter properties based on current filters
  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      // Status filter
      if (filters.status !== 'all' && property.status !== filters.status) {
        return false;
      }

      // Type filter
      if (filters.type !== 'all' && property.type !== filters.type) {
        return false;
      }

      // Price range filter
      if (filters.priceRange !== 'all') {
        const [min, max] = filters.priceRange.split('-').map(v => v === '' ? Infinity : parseInt(v));
        if (max && property.price > max) return false;
        if (min && property.price < min) return false;
      }

      // Area range filter
      if (filters.areaRange !== 'all') {
        const [min, max] = filters.areaRange.split('-').map(v => v === '' ? Infinity : parseInt(v));
        if (max && property.area > max) return false;
        if (min && property.area < min) return false;
      }

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        return (
          property.title.toLowerCase().includes(searchTerm) ||
          property.location.toLowerCase().includes(searchTerm) ||
          property.description.toLowerCase().includes(searchTerm) ||
          property.address.toLowerCase().includes(searchTerm)
        );
      }

      return true;
    });
  }, [filters, properties]);

  const formatPrice = (price) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    }
    return `$${price.toLocaleString()}`;
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      status: status || 'all',
      priceRange: 'all',
      areaRange: 'all',
      search: ''
    });
  };

  const getPageTitle = () => {
    if (status === 'for-sale') return 'Properties For Sale';
    if (status === 'for-rent') return 'Properties For Rent';
    return 'All Properties';
  };

  if (loading) return <div className="text-center py-12">Загрузка...</div>;
  if (error) return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {getPageTitle()}
          </h1>
          <p className="text-lg text-gray-600">
            Discover {filteredProperties.length} premium commercial properties
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Filter Properties</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search properties..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Property Type */}
            <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Property Type" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.types.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Price Range */}
            <Select value={filters.priceRange} onValueChange={(value) => handleFilterChange('priceRange', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.priceRanges.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Area Range */}
            <Select value={filters.areaRange} onValueChange={(value) => handleFilterChange('areaRange', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Area Range" />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.areaRanges.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter (only show if not already filtered by status) */}
          {!status && (
            <div className="mb-4">
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  {filterOptions.status.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Clear Filters */}
          <Button variant="outline" onClick={clearFilters} size="sm">
            Clear Filters
          </Button>
        </div>

        {/* View Mode Toggle & Results Count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600">
            Showing {filteredProperties.length} of {properties.length} properties
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Properties Grid/List */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No properties found matching your criteria.</p>
            <Button onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-6'
          }>
            {filteredProperties.map((property) => (
              <Card key={property._id || property.id} className={`overflow-hidden hover:shadow-xl transition-shadow group ${
                viewMode === 'list' ? 'flex flex-row' : ''
              }`}>
                <div className={`relative overflow-hidden ${
                  viewMode === 'list' ? 'w-80 h-48' : 'h-48'
                }`}>
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      property.status === 'for-sale' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {property.status === 'for-sale' ? 'For Sale' : 'For Rent'}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 bg-black/70 text-white text-xs rounded capitalize">
                      {property.type}
                    </span>
                  </div>
                </div>
                <CardContent className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
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
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {formatPrice(property.price)}
                        {property.status === 'for-rent' && <span className="text-sm text-gray-600">/month</span>}
                      </p>
                      <p className="text-sm text-gray-600">{property.area} sqm</p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <Link to={`/property/${property._id || property.id}`}>
                        View Details
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Load More Button (for future pagination) */}
        {filteredProperties.length > 0 && (
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Properties
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertiesPage;

