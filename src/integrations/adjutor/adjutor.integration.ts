import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';

@Injectable()
export class AdjutorIntegrationService {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: process.env.ADJUTOR_BASE_URL || 'https://adjutor.lendsqr.com/v2/verification',
      headers: {
        Authorization: `Bearer ${process.env.ADJUTOR_API_KEY}`, // API key for secure access
        'Content-Type': 'application/json',
      },
    });
  }

  async checkKarmaList(identity: string): Promise<boolean> {
    try {
        const response = await this.axiosInstance.get(`/karma/${identity}`);
        // Check if the blacklisted property exists and return true or false
        return response.data?.blacklisted === true;
    } catch (error) {
        // If the identity is not found or any error occurs, return false
        if (error.response) {
            // Adjutor API returned an error response; you can log the response if needed
            return false; // Treat API errors as "not blacklisted"
        } else {
            // Network or other error
            throw new HttpException(
                'Error connecting to Adjutor API',
                HttpStatus.SERVICE_UNAVAILABLE,
            );
        }
    }
}

}
