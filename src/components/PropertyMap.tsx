import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Expand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Property {
  id: string;
  name: string;
  address: string;
  rent_amount: number;
  rent_currency: string;
  property_type: string;
  bedrooms?: number;
  bathrooms?: number;
}

interface PropertyMapProps {
  properties: Property[];
  className?: string;
}

const PropertyMap: React.FC<PropertyMapProps> = ({ properties, className }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const miniMapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const miniMap = useRef<L.Map | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const miniMarkersRef = useRef<L.Marker[]>([]);

  // Geocoding function using Nominatim (free OpenStreetMap service)
  const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    return null;
  };

  // Create custom icon using the Piso logo
  const createCustomIcon = (size: [number, number]) => {
    return L.divIcon({
      html: `<div style="
        background-image: url(/lovable-uploads/84009c04-1bad-445a-85f7-9bdf971a5d43.png);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        width: 100%;
        height: 100%;
        cursor: pointer;
      "></div>`,
      className: 'custom-div-icon',
      iconSize: size,
      iconAnchor: [size[0] / 2, size[1]],
    });
  };

  // Initialize mini map
  const initializeMiniMap = async () => {
    if (!miniMapContainer.current) return;

    // Clear existing markers
    miniMarkersRef.current.forEach(marker => marker.remove());
    miniMarkersRef.current = [];

    if (miniMap.current) {
      miniMap.current.remove();
    }

    miniMap.current = L.map(miniMapContainer.current, {
      center: [51.5074, -0.1276], // Default to London
      zoom: 10,
      zoomControl: false,
      dragging: false,
      touchZoom: false,
      doubleClickZoom: false,
      scrollWheelZoom: false,
      boxZoom: false,
      keyboard: false,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(miniMap.current);

    // Add property markers to mini map
    const coordinates: [number, number][] = [];
    for (const property of properties) {
      const coords = await geocodeAddress(property.address);
      if (coords) {
        coordinates.push(coords);
        const marker = L.marker(coords, { 
          icon: createCustomIcon([20, 20])
        }).addTo(miniMap.current);
        miniMarkersRef.current.push(marker);
      }
    }

    // Fit map to show all markers
    if (coordinates.length > 0) {
      const group = new L.FeatureGroup(miniMarkersRef.current);
      miniMap.current.fitBounds(group.getBounds().pad(0.1));
    }
  };

  // Initialize full map
  const initializeFullMap = async () => {
    if (!mapContainer.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    if (map.current) {
      map.current.remove();
    }

    map.current = L.map(mapContainer.current, {
      center: [51.5074, -0.1276], // Default to London
      zoom: 10,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.current);

    // Add property markers to full map
    const coordinates: [number, number][] = [];
    for (const property of properties) {
      const coords = await geocodeAddress(property.address);
      if (coords) {
        coordinates.push(coords);
        
        const popupContent = `
          <div class="p-2">
            <h3 class="font-semibold text-sm">${property.name}</h3>
            <p class="text-xs text-gray-600">${property.address}</p>
            <p class="text-xs font-medium">${property.rent_currency}${property.rent_amount}/month</p>
            <p class="text-xs">${property.bedrooms || 0} bed, ${property.bathrooms || 0} bath</p>
          </div>
        `;

        const marker = L.marker(coords, { 
          icon: createCustomIcon([32, 32])
        })
        .addTo(map.current)
        .bindPopup(popupContent);

        marker.on('click', () => {
          setSelectedProperty(property);
        });

        markersRef.current.push(marker);
      }
    }

    // Fit map to show all markers
    if (coordinates.length > 0) {
      const group = new L.FeatureGroup(markersRef.current);
      map.current.fitBounds(group.getBounds().pad(0.1));
    }
  };

  useEffect(() => {
    initializeMiniMap();
    return () => {
      if (miniMap.current) {
        miniMap.current.remove();
      }
    };
  }, [properties]);

  useEffect(() => {
    if (isDialogOpen) {
      // Small delay to ensure dialog is rendered
      setTimeout(initializeFullMap, 100);
    }
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [isDialogOpen]);

  return (
    <>
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Property Map</h3>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Expand className="h-4 w-4 mr-1" />
                  Expand
                </Button>
              </DialogTrigger>
              <DialogContent className="fixed inset-0 w-screen h-screen max-w-none max-h-none p-6 m-0 rounded-none border-0 bg-background z-50">
                <DialogHeader className="pb-4">
                  <DialogTitle>Property Locations</DialogTitle>
                </DialogHeader>
                <div className="flex gap-4 h-[calc(100vh-8rem)]">
                  <div ref={mapContainer} className="flex-1 rounded-lg" />
                  {selectedProperty && (
                    <div className="w-80 space-y-4">
                      <Card>
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-lg">{selectedProperty.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{selectedProperty.address}</p>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Rent:</span>
                              <span className="font-medium">{selectedProperty.rent_currency}{selectedProperty.rent_amount}/month</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Type:</span>
                              <Badge variant="outline">{selectedProperty.property_type}</Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Bedrooms:</span>
                              <span>{selectedProperty.bedrooms || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Bathrooms:</span>
                              <span>{selectedProperty.bathrooms || 0}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div 
            ref={miniMapContainer} 
            className={`h-48 rounded-lg bg-muted cursor-pointer transition-opacity ${isDialogOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} 
            onClick={() => setIsDialogOpen(true)} 
          />
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{properties.length} properties</span>
            <span>Click to expand • Free OpenStreetMap</span>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default PropertyMap;