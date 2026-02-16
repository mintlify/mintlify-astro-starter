import { Icon } from '@mintlify/components';
import { MintlifyLogo } from './MintlifyLogo';

interface SocialLink {
  type: string;
  url: string;
}

interface SiteFooterProps {
  socials?: Record<string, string> | SocialLink[];
}

const socialIconMap: Record<string, string> = {
  x: 'x-twitter',
  twitter: 'x-twitter',
  github: 'github',
  linkedin: 'linkedin',
  discord: 'discord',
  slack: 'slack',
  youtube: 'youtube',
  facebook: 'facebook',
  instagram: 'instagram',
};

function SocialLinks({
  socials,
}: {
  socials: Record<string, string> | SocialLink[];
}) {
  const socialArray = Array.isArray(socials)
    ? socials
    : Object.entries(socials).map(([type, url]) => ({ type, url }));

  return (
    <div className="flex gap-6 flex-wrap">
      {socialArray.map((social) => {
        const iconName =
          socialIconMap[social.type.toLowerCase()] || social.type;
        return (
          <a
            key={social.url}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label={social.type}
          >
            <Icon icon={iconName} size={20} color="currentColor" />
          </a>
        );
      })}
    </div>
  );
}

export default function SiteFooter({ socials }: SiteFooterProps) {
  return (
    <footer className="border-t border-gray-200 mt-24">
      <div className="flex gap-12 justify-between items-center py-10">
        {socials ? <SocialLinks socials={socials} /> : <div />}
        <div className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 transition-colors">
          <a
            href="https://www.mintlify.com?utm_campaign=poweredBy&utm_medium=referral"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-baseline gap-1"
          >
            <span>Powered by</span>
            <MintlifyLogo className="h-4 w-auto translate-y-[3px]" />
          </a>
        </div>
      </div>
    </footer>
  );
}
