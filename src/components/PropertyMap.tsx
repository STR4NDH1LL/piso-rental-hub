import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Expand } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  const map = useRef<mapboxgl.Map | null>(null);
  const miniMap = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  // Geocoding function to convert address to coordinates
  const geocodeAddress = async (address: string, token: string): Promise<[number, number] | null> => {
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${token}&limit=1`
      );
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        return data.features[0].center;
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
    return null;
  };

  // Initialize mini map
  const initializeMiniMap = async () => {
    if (!miniMapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    miniMap.current = new mapboxgl.Map({
      container: miniMapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      zoom: 10,
      center: [-0.1276, 51.5074], // Default to London
      interactive: false,
    });

    // Add property markers to mini map
    for (const property of properties) {
      const coordinates = await geocodeAddress(property.address, mapboxToken);
      if (coordinates) {
        new mapboxgl.Marker({ color: '#3b82f6' })
          .setLngLat(coordinates)
          .addTo(miniMap.current);
      }
    }

    // Fit map to show all markers
    if (properties.length > 0) {
      const coordinates = await Promise.all(
        properties.map(p => geocodeAddress(p.address, mapboxToken))
      );
      const validCoordinates = coordinates.filter(Boolean) as [number, number][];
      
      if (validCoordinates.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        validCoordinates.forEach(coord => bounds.extend(coord));
        miniMap.current.fitBounds(bounds, { padding: 20 });
      }
    }
  };

  // Initialize full map
  const initializeFullMap = async () => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      zoom: 10,
      center: [-0.1276, 51.5074], // Default to London
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add property markers to full map
    for (const property of properties) {
      const coordinates = await geocodeAddress(property.address, mapboxToken);
      if (coordinates) {
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-2">
            <h3 class="font-semibold text-sm">${property.name}</h3>
            <p class="text-xs text-gray-600">${property.address}</p>
            <p class="text-xs font-medium">£${property.rent_amount}/month</p>
            <p class="text-xs">${property.bedrooms || 0} bed, ${property.bathrooms || 0} bath</p>
          </div>
        `);

        const marker = new mapboxgl.Marker({ color: '#3b82f6' })
          .setLngLat(coordinates)
          .setPopup(popup)
          .addTo(map.current);

        marker.getElement().addEventListener('click', () => {
          setSelectedProperty(property);
        });
      }
    }

    // Fit map to show all markers
    if (properties.length > 0) {
      const coordinates = await Promise.all(
        properties.map(p => geocodeAddress(p.address, mapboxToken))
      );
      const validCoordinates = coordinates.filter(Boolean) as [number, number][];
      
      if (validCoordinates.length > 0) {
        const bounds = new mapboxgl.LngLatBounds();
        validCoordinates.forEach(coord => bounds.extend(coord));
        map.current.fitBounds(bounds, { padding: 50 });
      }
    }
  };

  useEffect(() => {
    if (mapboxToken) {
      initializeMiniMap();
    }
    return () => {
      if (miniMap.current) {
        miniMap.current.remove();
      }
    };
  }, [mapboxToken, properties]);

  useEffect(() => {
    if (isDialogOpen && mapboxToken) {
      // Small delay to ensure dialog is rendered
      setTimeout(initializeFullMap, 100);
    }
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [isDialogOpen, mapboxToken]);

  if (!mapboxToken) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="h-5 w-5 text-primary" />
            <h3 className="font-semibold">Property Map</h3>
          </div>
          <div className="space-y-3">
            <div>
              <Label htmlFor="mapbox-token">Mapbox Public Token</Label>
              <Input
                id="mapbox-token"
                type="password"
                placeholder="pk.eyJ1..."
                value={mapboxToken}
                onChange={(e) => setMapboxToken(e.target.value)}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Get your free token at{' '}
              <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">
                mapbox.com
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
              <DialogContent className="max-w-4xl h-[80vh]">
                <DialogHeader>
                  <DialogTitle>Property Locations</DialogTitle>
                </DialogHeader>
                <div className="flex gap-4 h-full">
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
          <div ref={miniMapContainer} className="h-48 rounded-lg bg-muted cursor-pointer" 
               onClick={() => setIsDialogOpen(true)} />
          <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>{properties.length} properties</span>
            <span>Click to expand</span>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default PropertyMap;