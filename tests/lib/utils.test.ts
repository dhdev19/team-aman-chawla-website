import { formatCurrency, formatDate, generateSlug } from '@/lib/utils'

describe('Utility Functions', () => {
  describe('formatCurrency', () => {
    it('should format positive numbers correctly', () => {
      expect(formatCurrency(5000000)).toBe('₹50,00,000')
      expect(formatCurrency(100000)).toBe('₹1,00,000')
      expect(formatCurrency(10000000)).toBe('₹1,00,00,000')
    })

    it('should handle zero', () => {
      expect(formatCurrency(0)).toBe('₹0')
    })

    it('should handle null and undefined values', () => {
      expect(formatCurrency(null)).toBe('Price on request')
      expect(formatCurrency(undefined)).toBe('Price on request')
    })

    it('should handle decimal values', () => {
      expect(formatCurrency(5000000.50)).toBe('₹50,00,001')
    })
  })

  describe('formatDate', () => {
    it('should format dates correctly', () => {
      const date = new Date('2024-01-15')
      expect(formatDate(date)).toBe('15 Jan 2024')
    })

    it('should handle string dates', () => {
      expect(formatDate('2024-01-15')).toBe('15 Jan 2024')
    })

    it('should handle null and undefined values', () => {
      expect(formatDate(null)).toBe('')
      expect(formatDate(undefined)).toBe('')
    })

    it('should accept custom format', () => {
      const date = new Date('2024-01-15')
      expect(formatDate(date, 'dd/MM/yyyy')).toBe('15/01/2024')
    })
  })

  describe('generateSlug', () => {
    it('should generate slugs correctly', () => {
      expect(generateSlug('Test Property')).toBe('test-property')
      expect(generateSlug('Luxury Apartment in Mumbai')).toBe('luxury-apartment-in-mumbai')
      expect(generateSlug('2BHK Flat')).toBe('2bhk-flat')
    })

    it('should handle special characters', () => {
      expect(generateSlug('Property @ Special Price!')).toBe('property-special-price')
      expect(generateSlug('Test & Demo')).toBe('test-demo')
    })

    it('should handle multiple spaces and hyphens', () => {
      expect(generateSlug('Test   Property   Name')).toBe('test-property-name')
      expect(generateSlug('Test---Property')).toBe('test-property')
    })

    it('should handle empty strings', () => {
      expect(generateSlug('')).toBe('')
    })

    it('should convert to lowercase', () => {
      expect(generateSlug('TEST PROPERTY')).toBe('test-property')
    })
  })
})
