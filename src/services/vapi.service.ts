import axios from 'axios';
import { config } from '../config';

const VAPI_BASE_URL = 'https://api.vapi.ai';

interface VapiMessage {
  type: string;
  role: string;
  content: string;
  timestamp?: number;
}

export const sendVapiResponse = async (
  callId: string,
  message: string
): Promise<void> => {
  try {
    console.log(`[Vapi Response] Sending to call ${callId}: ${message.substring(0, 100)}...`);

    await axios.post(
      `${VAPI_BASE_URL}/call/${callId}/message`,
      { message: message },
      {
        headers: {
          'Authorization': `Bearer ${config.VAPI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    console.log(`✅ Response sent successfully to Vapi`);
  } catch (error) {
    console.error('Failed to send Vapi response:', error);
    // Don't throw - allow webhook to complete even if response send fails
  }
};

export interface VapiWebhookPayload {
  message: VapiMessage;
  call: {
    id: string;
    status: string;
    transcript?: string;
    duration?: number;
  };
  messages: VapiMessage[];
}

export const parseVapiWebhook = (payload: any): VapiWebhookPayload => {
  return {
    message: payload.message || {},
    call: payload.call || {},
    messages: payload.messages || [],
  };
};
