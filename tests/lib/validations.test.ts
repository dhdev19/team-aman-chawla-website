import { propertySchema } from '@/lib/validations/property'
import { blogSchema } from '@/lib/validations/blog'
import { careerApplicationSchema } from '@/lib/validations/career'

describe('Validation Schemas', () => {
  describe('propertySchema', () => {
    it('should validate valid property data', () => {
      const validData = {
        name: 'Test Property',
        type: 'RESIDENTIAL',
        format: 'APARTMENT',
        builder: 'Test Builder',
        description: 'Test description',
        price: 50000000, // Number as per schema
        location: 'Test Location',
        status: 'AVAILABLE',
        mainImage: '/test-images/1.jpg',
        images: ['/test-images/2.jpg'],
        amenities: ['Swimming Pool'],
        projectLaunchDate: '2024-01-15T10:00:00',
      }

      const result = propertySchema.parse(validData)
      
      // Check that the result has the expected structure and values
      expect(result.name).toBe('Test Property')
      expect(result.type).toBe('RESIDENTIAL')
      expect(result.format).toBe('APARTMENT')
      expect(result.builder).toBe('Test Builder')
      expect(result.description).toBe('Test description')
      expect(result.price).toBe(50000000)
      expect(result.location).toBe('Test Location')
      expect(result.status).toBe('AVAILABLE')
      expect(result.mainImage).toBe('/test-images/1.jpg')
      expect(result.images).toEqual(['/test-images/2.jpg'])
      expect(result.amenities).toEqual(['Swimming Pool'])
      expect(result.projectLaunchDate).toBe('2024-01-15T10:00:00')
    })

    it('should validate property with minimal required fields', () => {
      const minimalData = {
        name: 'Test Property',
        type: 'RESIDENTIAL',
        builder: 'Test Builder',
        status: 'AVAILABLE',
      }

      const result = propertySchema.parse(minimalData)
      expect(result.name).toBe('Test Property')
      expect(result.type).toBe('RESIDENTIAL')
    })

    it('should reject invalid property type', () => {
      const invalidData = {
        name: 'Test Property',
        type: 'INVALID_TYPE',
        builder: 'Test Builder',
        status: 'AVAILABLE',
      }

      expect(() => propertySchema.parse(invalidData)).toThrow()
    })

    it('should reject missing required fields', () => {
      const invalidData = {
        name: 'Test Property',
        // Missing type, builder, status
      }

      expect(() => propertySchema.parse(invalidData)).toThrow()
    })

    it('should validate slug format', () => {
      const validSlugData = {
        name: 'Test Property',
        type: 'RESIDENTIAL',
        builder: 'Test Builder',
        status: 'AVAILABLE',
        slug: 'test-property',
      }

      const result = propertySchema.parse(validSlugData)
      expect(result.slug).toBe('test-property')
    })

    it('should reject invalid slug format', () => {
      const invalidSlugData = {
        name: 'Test Property',
        type: 'RESIDENTIAL',
        builder: 'Test Builder',
        status: 'AVAILABLE',
        slug: 'Test Property_Invalid',
      }

      expect(() => propertySchema.parse(invalidSlugData)).toThrow()
    })

    it('should validate project launch date format', () => {
      const validDateData = {
        name: 'Test Property',
        type: 'RESIDENTIAL',
        builder: 'Test Builder',
        status: 'AVAILABLE',
        projectLaunchDate: '2024-01-15T10:00',
      }

      const result = propertySchema.parse(validDateData)
      expect(result.projectLaunchDate).toBe('2024-01-15T10:00')
    })

    it('should reject invalid date format', () => {
      const invalidDateData = {
        name: 'Test Property',
        type: 'RESIDENTIAL',
        builder: 'Test Builder',
        status: 'AVAILABLE',
        projectLaunchDate: 'invalid-date',
      }

      expect(() => propertySchema.parse(invalidDateData)).toThrow()
    })
  })

  describe('blogSchema', () => {
    it('should validate valid blog data', () => {
      const validData = {
        title: 'Test Blog',
        slug: 'test-blog',
        type: 'TEXT',
        content: 'Test blog content with sufficient length'.repeat(5), // Make it 100+ chars
        excerpt: 'Test excerpt',
        image: '/test-images/1.jpg',
        published: true,
        metaTitle: 'Test Blog',
        metaKeywords: 'test,blog',
        metaDescription: 'Test blog description',
      }

      const result = blogSchema.parse(validData)
      expect(result).toEqual(validData)
    })

    it('should validate blog with minimal required fields', () => {
      const minimalData = {
        title: 'Test Blog',
        slug: 'test-blog',
        type: 'TEXT',
        content: 'Test blog content with sufficient length'.repeat(5), // Make it 100+ chars
      }

      const result = blogSchema.parse(minimalData)
      expect(result.title).toBe('Test Blog')
      expect(result.type).toBe('TEXT')
    })

    it('should validate video blog with video URL', () => {
      const videoData = {
        title: 'Test Video Blog',
        slug: 'test-video-blog',
        type: 'VIDEO',
        content: 'Test video blog content with sufficient length'.repeat(5), // Make it 100+ chars
        videoUrl: 'https://www.youtube.com/watch?v=test123',
        videoThumbnail: '/test-images/1.jpg',
      }

      const result = blogSchema.parse(videoData)
      expect(result.type).toBe('VIDEO')
      expect(result.videoUrl).toBe('https://www.youtube.com/watch?v=test123')
    })

    it('should reject invalid blog type', () => {
      const invalidData = {
        title: 'Test Blog',
        slug: 'test-blog',
        type: 'INVALID_TYPE',
        content: 'Test blog content with sufficient length'.repeat(5), // Make it 100+ chars
      }

      expect(() => blogSchema.parse(invalidData)).toThrow()
    })

    it('should reject missing required fields', () => {
      const invalidData = {
        title: 'Test Blog',
        // Missing slug, type, content
      }

      expect(() => blogSchema.parse(invalidData)).toThrow()
    })

    it('should reject short content', () => {
      const invalidData = {
        title: 'Test Blog',
        slug: 'test-blog',
        type: 'TEXT',
        content: 'Short', // Too short
      }

      expect(() => blogSchema.parse(invalidData)).toThrow()
    })

    it('should reject invalid slug format', () => {
      const invalidSlugData = {
        title: 'Test Blog',
        slug: 'Test Blog_Invalid',
        type: 'TEXT',
        content: 'Test blog content with sufficient length'.repeat(5), // Make it 100+ chars
      }

      expect(() => blogSchema.parse(invalidSlugData)).toThrow()
    })

    it('should require video URL for video blogs', () => {
      const invalidVideoData = {
        title: 'Test Video Blog',
        slug: 'test-video-blog',
        type: 'VIDEO',
        content: 'Test video blog content with sufficient length'.repeat(5), // Make it 100+ chars
        // Missing videoUrl
      }

      expect(() => blogSchema.parse(invalidVideoData)).toThrow()
    })
  })

  describe('careerApplicationSchema', () => {
    it('should validate valid career application', () => {
      const validData = {
        name: 'Test Applicant',
        email: 'applicant@example.com',
        whatsappNumber: '9876543210', // Valid Indian number starting with 9
        city: 'Test City',
        referralSource: 'WEBSITE',
        resumeLink: 'https://drive.google.com/file/d/test123/view',
      }

      const result = careerApplicationSchema.parse(validData)
      expect(result).toEqual(validData)
    })

    it('should validate career application with minimal fields', () => {
      const minimalData = {
        name: 'Test Applicant',
        email: 'applicant@example.com',
        whatsappNumber: '9876543210', // Valid Indian number starting with 9
        city: 'Test City',
        referralSource: 'FAMILY_FRIENDS',
        resumeLink: 'https://drive.google.com/file/d/test123/view',
      }

      const result = careerApplicationSchema.parse(minimalData)
      expect(result.name).toBe('Test Applicant')
      expect(result.referralSource).toBe('FAMILY_FRIENDS')
    })

    it('should reject invalid email format', () => {
      const invalidData = {
        name: 'Test Applicant',
        email: 'invalid-email',
        whatsappNumber: '9876543210',
        city: 'Test City',
        referralSource: 'WEBSITE',
        resumeLink: 'https://drive.google.com/file/d/test123/view',
      }

      expect(() => careerApplicationSchema.parse(invalidData)).toThrow()
    })

    it('should reject invalid WhatsApp number', () => {
      const invalidData = {
        name: 'Test Applicant',
        email: 'applicant@example.com',
        whatsappNumber: '1234567890', // Invalid - doesn't start with 6-9
        city: 'Test City',
        referralSource: 'WEBSITE',
        resumeLink: 'https://drive.google.com/file/d/test123/view',
      }

      expect(() => careerApplicationSchema.parse(invalidData)).toThrow()
    })

    it('should reject invalid referral source', () => {
      const invalidData = {
        name: 'Test Applicant',
        email: 'applicant@example.com',
        whatsappNumber: '9876543210',
        city: 'Test City',
        referralSource: 'INVALID_SOURCE',
        resumeLink: 'https://drive.google.com/file/d/test123/view',
      }

      expect(() => careerApplicationSchema.parse(invalidData)).toThrow()
    })

    it('should reject invalid resume URL', () => {
      const invalidData = {
        name: 'Test Applicant',
        email: 'applicant@example.com',
        whatsappNumber: '9876543210',
        city: 'Test City',
        referralSource: 'WEBSITE',
        resumeLink: 'https://invalid-url.com/file.pdf', // Not an allowed domain
      }

      expect(() => careerApplicationSchema.parse(invalidData)).toThrow()
    })

    it('should require other source when referral source is OTHER', () => {
      const invalidData = {
        name: 'Test Applicant',
        email: 'applicant@example.com',
        whatsappNumber: '9876543210',
        city: 'Test City',
        referralSource: 'OTHER',
        // Missing referralOther
        resumeLink: 'https://drive.google.com/file/d/test123/view',
      }

      expect(() => careerApplicationSchema.parse(invalidData)).toThrow()
    })

    it('should validate with other source when referral source is OTHER', () => {
      const validData = {
        name: 'Test Applicant',
        email: 'applicant@example.com',
        whatsappNumber: '9876543210',
        city: 'Test City',
        referralSource: 'OTHER',
        referralOther: 'Social Media',
        resumeLink: 'https://drive.google.com/file/d/test123/view',
      }

      const result = careerApplicationSchema.parse(validData)
      expect(result.referralOther).toBe('Social Media')
    })

    it('should accept Dropbox resume URL', () => {
      const validData = {
        name: 'Test Applicant',
        email: 'applicant@example.com',
        whatsappNumber: '9876543210',
        city: 'Test City',
        referralSource: 'WEBSITE',
        resumeLink: 'https://www.dropbox.com/s/test123/resume.pdf',
      }

      const result = careerApplicationSchema.parse(validData)
      expect(result.resumeLink).toBe('https://www.dropbox.com/s/test123/resume.pdf')
    })

    it('should accept OneDrive resume URL', () => {
      const validData = {
        name: 'Test Applicant',
        email: 'applicant@example.com',
        whatsappNumber: '9876543210',
        city: 'Test City',
        referralSource: 'WEBSITE',
        resumeLink: 'https://onedrive.live.com/s/test123/resume.pdf',
      }

      const result = careerApplicationSchema.parse(validData)
      expect(result.resumeLink).toBe('https://onedrive.live.com/s/test123/resume.pdf')
    })
  })
})
