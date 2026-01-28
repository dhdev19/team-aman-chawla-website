import { GET, POST } from '../../../app/api/admin/properties/route'
import { createMockRequest, mockProperty } from '../../utils/test-helpers'

// Mock dependencies
jest.mock('../../../lib/auth-server', () => ({
  requireAdmin: jest.fn().mockResolvedValue(true),
}))

jest.mock('../../../lib/prisma', () => ({
  prisma: {
    property: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    },
  },
}))

jest.mock('../../../lib/validations/property', () => ({
  propertySchema: {
    parse: jest.fn(),
  },
}))

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn(),
  },
}))

// Get mocked modules
const { requireAdmin } = require('../../../lib/auth-server')
const { prisma } = require('../../../lib/prisma')
const { propertySchema } = require('../../../lib/validations/property')

describe('/api/admin/properties', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('GET /api/admin/properties', () => {
    it('should return paginated properties for admin', async () => {
      // Arrange
      const mockProperties = [mockProperty]
      const mockCount = 1
      
      prisma.property.findMany.mockResolvedValue(mockProperties)
      prisma.property.count.mockResolvedValue(mockCount)
      
      const request = createMockRequest('http://localhost:3000/api/admin/properties?page=1&limit=25')
      
      // Act
      const response = await GET(request)
      
      // Assert
      expect(response).toBeDefined()
      expect(requireAdmin).toHaveBeenCalled()
      expect(prisma.property.findMany).toHaveBeenCalled()
      expect(prisma.property.count).toHaveBeenCalled()
    })

    it('should filter properties by search term', async () => {
      // Arrange
      prisma.property.findMany.mockResolvedValue([])
      prisma.property.count.mockResolvedValue(0)
      
      const request = createMockRequest('http://localhost:3000/api/admin/properties?search=test')
      
      // Act
      const response = await GET(request)
      
      // Assert
      expect(response).toBeDefined()
      expect(prisma.property.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { name: { contains: 'test', mode: 'insensitive' } },
            { builder: { contains: 'test', mode: 'insensitive' } },
            { location: { contains: 'test', mode: 'insensitive' } },
          ],
        },
        skip: 0,
        take: 25,
        orderBy: { createdAt: 'desc' },
      })
    })

    it('should handle unauthorized access', async () => {
      // Arrange
      requireAdmin.mockRejectedValue(new Error('Unauthorized'))
      
      const mockRequest = createMockRequest('http://localhost:3000/api/admin/properties')
      
      // Act
      const response = await GET(mockRequest)
      
      // Assert
      expect(response).toBeDefined()
    })
  })

  describe('POST /api/admin/properties', () => {
    it('should create a new property', async () => {
      // Arrange
      const newProperty = { ...mockProperty, id: '2' }
      prisma.property.create.mockResolvedValue(newProperty)
      
      const mockBody = {
        name: 'New Property',
        type: 'RESIDENTIAL',
        status: 'AVAILABLE',
        price: '50 Lac',
        builder: 'Test Builder',
      }
      
      const mockRequest = createMockRequest(
        'http://localhost:3000/api/admin/properties',
        mockBody
      )

      // Act
      await POST(mockRequest)

      // Assert
      expect(requireAdmin).toHaveBeenCalled()
      expect(prisma.property.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'New Property',
          type: 'RESIDENTIAL',
          status: 'AVAILABLE',
          price: '50 Lac',
          builder: 'Test Builder',
        }),
      })
      expect(mockJson).toHaveBeenCalledWith({
        success: true,
        data: newProperty,
        message: 'Property created successfully',
      })
    })

    it('should handle validation errors', async () => {
      // Arrange
      propertySchema.parse.mockImplementation(() => {
        throw new Error('Validation failed')
      })
      
      const mockBody = { name: '' } // Invalid data
      
      const request = createMockRequest('http://localhost:3000/api/admin/properties', mockBody)
      
      // Act
      const response = await POST(request)
      
      // Assert
      expect(response).toBeDefined()
    })
  })
})
