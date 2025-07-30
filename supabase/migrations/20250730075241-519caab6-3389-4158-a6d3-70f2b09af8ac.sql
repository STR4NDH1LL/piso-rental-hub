-- Just add demo properties for the landlord account (without tenant assignments for now)
INSERT INTO public.properties (
  landlord_id,
  name,
  address,
  description,
  property_type,
  bedrooms,
  bathrooms,
  rent_amount,
  rent_currency
) VALUES 
(
  'f47ac10b-58cc-4372-a567-0e02b2c3d479', -- Demo landlord UUID
  'Victoria Gardens Apartment',
  '123 Victoria Street, London, SW1V 4RB, UK',
  'Modern 2-bedroom apartment in prime Victoria location with excellent transport links.',
  'apartment',
  2,
  2,
  2500,
  '£'
),
(
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'Camden Town House',
  '45 Camden High Street, London, NW1 7JN, UK', 
  'Stylish 3-bedroom Victorian house in vibrant Camden with garden.',
  'house',
  3,
  2,
  3200,
  '£'
),
(
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'Shoreditch Loft',
  '78 Brick Lane, London, E1 6RL, UK',
  'Contemporary 1-bedroom loft in trendy Shoreditch area.',
  'apartment', 
  1,
  1,
  1800,
  '£'
),
(
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'Kensington Studio',
  '156 Kensington High Street, London, W8 7RG, UK',
  'Luxury studio apartment in prestigious Kensington location.',
  'studio',
  0,
  1,
  1500,
  '£'
),
(
  'f47ac10b-58cc-4372-a567-0e02b2c3d479',
  'Greenwich Riverside Flat',
  '89 Greenwich Park Road, London, SE10 9JA, UK',
  'Beautiful 2-bedroom flat with river views in historic Greenwich.',
  'apartment',
  2,
  1,
  2200,
  '£'
) ON CONFLICT DO NOTHING;