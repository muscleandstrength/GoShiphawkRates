export interface Address {
  name?: string;
  company?: string;
  street1?: string;
  street2?: string;
  city?: string;
  state?: string;
  zip: string;
  country?: string;
  phone_number?: string;
}

export interface PackageItem {
  name?: string;
  description?: string;
  sku?: string;
  weight: number;
  weight_uom: string;
  quantity: number;
  value?: number;
  hs_code?: string;
  country_of_origin: string;
  length?: number;
  width?: number;
  height?: number;
}

export interface ShipmentRequest {
  items: PackageItem[];
  warehouse_code?: string;
  carrier_filter?: string[];
  origin_address?: Address;
  destination_address?: Address;
  origin_zip?: string;
  destination_zip?: string;
  destination_country_id?: string;
}

export interface Rate {
  carrier: string;
  service_name?: string;
  service_level?: string;
  price: string;
  service_days?: number;
  est_delivery_date?: string;
}

export interface QuoteResponse {
  rates: Rate[];
}

export interface Carrier {
  code: string;
  name: string;
}