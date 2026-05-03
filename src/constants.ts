/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Unit, UnitCategory } from './types';

export const UNITS: Record<UnitCategory, Unit[]> = {
  length: [
    { id: 'm', name: 'Meter', symbol: 'm', factor: 1 },
    { id: 'km', name: 'Kilometer', symbol: 'km', factor: 1000 },
    { id: 'cm', name: 'Centimeter', symbol: 'cm', factor: 0.01 },
    { id: 'mm', name: 'Millimeter', symbol: 'mm', factor: 0.001 },
    { id: 'mi', name: 'Mile', symbol: 'mi', factor: 1609.34 },
    { id: 'yd', name: 'Yard', symbol: 'yd', factor: 0.9144 },
    { id: 'ft', name: 'Foot', symbol: 'ft', factor: 0.3048 },
    { id: 'in', name: 'Inch', symbol: 'in', factor: 0.0254 },
  ],
  weight: [
    { id: 'kg', name: 'Kilogram', symbol: 'kg', factor: 1 },
    { id: 'g', name: 'Gram', symbol: 'g', factor: 0.001 },
    { id: 'mg', name: 'Milligram', symbol: 'mg', factor: 0.000001 },
    { id: 'lb', name: 'Pound', symbol: 'lb', factor: 0.453592 },
    { id: 'oz', name: 'Ounce', symbol: 'oz', factor: 0.0283495 },
    { id: 'st', name: 'Stone', symbol: 'st', factor: 6.35029 },
  ],
  temperature: [
    { id: 'c', name: 'Celsius', symbol: '°C', factor: 1, offset: 0 },
    { id: 'f', name: 'Fahrenheit', symbol: '°F', factor: 0.5555555555555556, offset: 32 },
    { id: 'k', name: 'Kelvin', symbol: 'K', factor: 1, offset: 273.15 },
  ],
  volume: [
    { id: 'l', name: 'Liter', symbol: 'L', factor: 1 },
    { id: 'ml', name: 'Milliliter', symbol: 'ml', factor: 0.001 },
    { id: 'gal', name: 'Gallon (US)', symbol: 'gal', factor: 3.78541 },
    { id: 'qt', name: 'Quart (US)', symbol: 'qt', factor: 0.946353 },
    { id: 'pt', name: 'Pint (US)', symbol: 'pt', factor: 0.473176 },
    { id: 'cup', name: 'Cup (US)', symbol: 'cup', factor: 0.236588 },
    { id: 'floz', name: 'Fluid Ounce (US)', symbol: 'fl oz', factor: 0.0295735 },
  ],
  area: [
    { id: 'sqm', name: 'Square Meter', symbol: 'm²', factor: 1 },
    { id: 'sqkm', name: 'Square Kilometer', symbol: 'km²', factor: 1000000 },
    { id: 'sqmi', name: 'Square Mile', symbol: 'mi²', factor: 2589988.11 },
    { id: 'acre', name: 'Acre', symbol: 'ac', factor: 4046.86 },
    { id: 'hectare', name: 'Hectare', symbol: 'ha', factor: 10000 },
  ],
  speed: [
    { id: 'mps', name: 'Meters per second', symbol: 'm/s', factor: 1 },
    { id: 'kph', name: 'Kilometers per hour', symbol: 'km/h', factor: 0.277778 },
    { id: 'mph', name: 'Miles per hour', symbol: 'mph', factor: 0.44704 },
    { id: 'knot', name: 'Knot', symbol: 'kn', factor: 0.514444 },
  ],
  time: [
    { id: 's', name: 'Second', symbol: 's', factor: 1 },
    { id: 'min', name: 'Minute', symbol: 'min', factor: 60 },
    { id: 'h', name: 'Hour', symbol: 'h', factor: 3600 },
    { id: 'd', name: 'Day', symbol: 'd', factor: 86400 },
    { id: 'wk', name: 'Week', symbol: 'wk', factor: 604800 },
    { id: 'mo', name: 'Month', symbol: 'mo', factor: 2629746 },
    { id: 'yr', name: 'Year', symbol: 'yr', factor: 31556952 },
  ],
  digital: [
    { id: 'b', name: 'Byte', symbol: 'B', factor: 1 },
    { id: 'kb', name: 'Kilobyte', symbol: 'KB', factor: 1024 },
    { id: 'mb', name: 'Megabyte', symbol: 'MB', factor: 1024 * 1024 },
    { id: 'gb', name: 'Gigabyte', symbol: 'GB', factor: 1024 * 1024 * 1024 },
    { id: 'tb', name: 'Terabyte', symbol: 'TB', factor: 1024 * 1024 * 1024 * 1024 },
  ],
  currency: [
    { id: 'usd', name: 'US Dollar', symbol: '$', factor: 1 },
    { id: 'eur', name: 'Euro', symbol: '€', factor: 1.09 },
    { id: 'gbp', name: 'British Pound', symbol: '£', factor: 1.27 },
    { id: 'jpy', name: 'Japanese Yen', symbol: '¥', factor: 0.0066 },
    { id: 'aed', name: 'UAE Dirham', symbol: 'د.إ', factor: 0.2723 },
    { id: 'sar', name: 'Saudi Riyal', symbol: 'ر.س', factor: 0.2666 },
    { id: 'inr', name: 'Indian Rupee', symbol: '₹', factor: 0.012 },
    { id: 'cny', name: 'Chinese Yuan', symbol: '¥', factor: 0.14 },
    { id: 'cad', name: 'Canadian Dollar', symbol: 'C$', factor: 0.74 },
    { id: 'aud', name: 'Australian Dollar', symbol: 'A$', factor: 0.66 },
  ],
};
