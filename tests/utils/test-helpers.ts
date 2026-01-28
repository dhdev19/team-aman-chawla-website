import { NextRequest } from 'next/server'
import { PropertyType, PropertyFormat, PropertyStatus } from '@prisma/client'

// Helper to create mock NextRequest
export const createMockRequest = (url: string, body?: any): NextRequest => {
  const request = {
    url,
    nextUrl: {
      searchParams: new URLSearchParams(url.split('?')[1] || ''),
    },
    json: body ? jest.fn().mockResolvedValue(body) : jest.fn(),
  } as any
  
  return request
}

// Helper to create mock params
export const createMockParams = (params: Record<string, string>) => {
  return Promise.resolve(params)
}

// Helper to create mock Prisma error
export const createPrismaError = (message: string, code?: string) => {
  const error = new Error(message) as any
  if (code) {
    error.code = code
  }
  return error
}

// Mock property data - matches database schema exactly
export const mockProperty = {
  id: '1',
  name: 'Test Property',
  slug: 'test-property',
  type: PropertyType.RESIDENTIAL,
  format: PropertyFormat.APARTMENT,
  builder: 'Test Builder',
  builderReraNumber: 'TEST123',
  description: 'Test description',
  price: 5000000, // Float? from database
  location: 'Test Location',
  locationAdvantages: ['Near Metro', 'Good Schools'],
  status: PropertyStatus.AVAILABLE,
  mainImage: '/test-images/1.jpg',
  images: ['/test-images/2.jpg', '/test-images/3.jpg'],
  amenities: ['Swimming Pool', 'Gym'],
  mapImage: '/test-images/4.jpg',
  projectLaunchDate: new Date('2024-01-01'),
  builderReraQrCode: '/test-images/rera.png',
  possession: 'Ready to Move',
  metaTitle: 'Test Property',
  metaKeywords: 'test,property',
  metaDescription: 'Test property description',
  bankAccountName: 'Test Bank',
  bankName: 'Test Bank',
  bankAccountNumber: '1234567890',
  bankIfsc: 'TEST123',
  bankBranch: 'Test Branch',
  configurations: [],
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

// Mock blog data
export const mockBlog = {
  id: '1',
  title: 'Test Blog',
  slug: 'test-blog',
  type: 'NEWS',
  content: 'Test blog content',
  excerpt: 'Test excerpt',
  featuredImage: '/test-images/1.jpg',
  images: ['/test-images/2.jpg'],
  published: true,
  metaTitle: 'Test Blog',
  metaKeywords: 'test,blog',
  metaDescription: 'Test blog description',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

// Mock enquiry data
export const mockEnquiry = {
  id: '1',
  name: 'Test User',
  email: 'test@example.com',
  phone: '1234567890',
  message: 'Test message',
  type: 'contact',
  propertyId: null,
  property: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

// Mock video data
export const mockVideo = {
  id: '1',
  title: 'Test Video',
  videoLink: 'https://www.youtube.com/watch?v=test',
  thumbnail: '/test-images/1.jpg',
  description: 'Test video description',
  order: 1,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}

// Mock career application data
export const mockCareerApplication = {
  id: '1',
  name: 'Test Applicant',
  email: 'applicant@example.com',
  whatsappNumber: '1234567890',
  city: 'Test City',
  referralSource: 'WEBSITE',
  referralOther: null,
  resumeLink: '/test-resumes/test.pdf',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
}
