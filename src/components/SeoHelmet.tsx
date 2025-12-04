import React, { useEffect } from 'react';
import { ToolConfig } from '../types';

interface SeoHelmetProps {
  tool?: ToolConfig;
}

export const SeoHelmet: React.FC<SeoHelmetProps> = ({ tool }) => {
  useEffect(() => {
    // Base configuration
    const baseTitle = 'All Things Doc - Free Online PDF & Document Tools';
    const baseDesc =
      '100% Free online tools to merge, split, compress PDF, convert Word to PDF, and more. No installation required. Secure and fast.';

    // Logic to generate title/description
    let title = baseTitle;
    let description = baseDesc;

    if (tool) {
      // Create a high-ranking title structure: "Tool Name - Primary Benefit"
      title = `${tool.title} - Free Online Tool | All Things Doc`;

      // If specific keywords exist, append the first one to the title for SEO juice
      if (tool.keywords && tool.keywords.length > 0) {
        title = `${tool.title} - ${tool.keywords[0]} - Free Online`;
      }

      description = `${tool.description} Use our free ${tool.title} tool online. Fast, secure, and works on any device.`;
    }

    // Update Document Title
    document.title = title;

    // Update Meta Description
    let metaDescription = document.querySelector("meta[name='description']");
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Update Keywords (if tool has them)
    if (tool && tool.keywords) {
      let metaKeywords = document.querySelector("meta[name='keywords']");
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      // Combine tool keywords with some global ones
      const globalKeywords = 'pdf, tools, online, converter, free';
      metaKeywords.setAttribute('content', `${tool.keywords.join(', ')}, ${globalKeywords}`);
    }
  }, [tool]);

  return null; // This component doesn't render any visible UI
};
