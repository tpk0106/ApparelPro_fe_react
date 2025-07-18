export interface PurchaseOrder {
  buyerCode: number;
  buyer: string;
  order: string;
  description: string;
  quotaQuantity: number;
  orderDate: Date;
  garmentType: string;
  garmentTypeName: string;
  countryCode: string;
  unitCode: string;
  totalQuantity: number;
  currencyCode: string;
  season: string;
  basisCode: string;
  basisValue: number;
}
