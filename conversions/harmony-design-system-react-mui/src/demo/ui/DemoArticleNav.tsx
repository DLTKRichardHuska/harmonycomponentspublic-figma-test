import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

interface DemoArticleNavLink {
  href: string;
  label: string;
}

interface DemoArticleNavProps {
  links: DemoArticleNavLink[];
}

export function DemoArticleNav({ links }: DemoArticleNavProps) {
  return (
    <Stack direction="row" spacing={2} sx={{ mb: 4, gap: 2, flexWrap: 'wrap' }}>
      {links.map((link) => (
        <Typography key={link.href} component="a" href={link.href} variant="body2" color="primary">
          {link.label}
        </Typography>
      ))}
    </Stack>
  );
}
