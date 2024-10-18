import { UnauthorizedException } from "@nestjs/common";
import axios from 'axios';


export async function verifyGoogleAccessToken(accessToken: string): Promise<boolean> {
    
    const url = `${process.env.VERIFY_GOOGLE_TOKEN_URL}?access_token=${accessToken}`;
    // this.httpService.get(url).toPromise()
    try {
      const response = await axios.get(url);
      
      console.log(response.data)
      
      if (response.data && response.data.expires_in > 0) {
        return true;  
      }
      
      return false
    } catch (error) {
      // Catch any error (e.g., invalid token, expired token)
      return false; // Token is invalid
    }
  }