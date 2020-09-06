import axios from 'axios';

import { SFWVerdict } from '@/common/types';
import env from '@/config/env';
import apiConfig from '@/config/api';

export async function isNSFW(url: string): Promise<SFWVerdict> {
  const { data } = await axios.post(
    `${apiConfig.url}/${apiConfig.modelId}/outputs`,
    {
      inputs: [
        {
          data: {
            image: {
              url,
            },
          },
        },
      ],
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Key ${env.CLARIFAI_KEY}`,
      },
    },
  );

  const concepts = data.outputs[0].data.concepts;

  for (const concept of concepts) {
    if (concept.name === apiConfig.conceptName &&
      concept.value >= apiConfig.confidence
    ) {
      return {
        isSFW: false,
        confidence: concept.value,
      };
    }
  }

  return {
    isSFW: true,
  };
}
