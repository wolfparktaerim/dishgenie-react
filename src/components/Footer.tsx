// src/components/Footer.tsx

import React from 'react';
import styled from 'styled-components';
import { Facebook, Twitter, Instagram } from 'lucide-react';

interface FooterProps {
  className?: string;
}

const FooterWrapper = styled.footer`
  background-color: #1f2937; /* Tailwind bg-gray-800 */
  color: white;
  padding: 2rem 0;
  margin-top: auto;
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const SectionTitle = styled.h5`
  font-weight: 600;
  margin-bottom: 1rem;
`;

const LinkList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const LinkItem = styled.li`
  margin-bottom: 0.5rem;

  a {
    color: white;
    text-decoration: none;

    &:hover {
      color: #d1d5db; /* Tailwind hover:text-gray-300 */
    }
  }
`;

const SocialWrapper = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialIcon = styled.a`
  color: white;

  &:hover {
    color: #d1d5db;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const Copyright = styled.div`
  margin-top: 2rem;
  text-align: center;
  color: #9ca3af; /* Tailwind text-gray-400 */
`;

const footerSections = [
  {
    title: 'About',
    items: ['About Us', 'Careers', 'Press']
  },
  {
    title: 'Support',
    items: ['Help Center', 'Safety', 'Cancellation Options']
  },
  {
    title: 'Legal',
    items: ['Terms of Service', 'Privacy Policy', 'Cookie Policy']
  }
];

const socialIcons = [
  { name: 'Facebook', icon: <Facebook /> },
  { name: 'Twitter', icon: <Twitter /> },
  { name: 'Instagram', icon: <Instagram /> }
];

const Footer: React.FC<FooterProps> = ({ className }) => {
  const year = new Date().getFullYear();

  return (
    <FooterWrapper className={className}>
      <Container>
        <Grid>
          {footerSections.map(section => (
            <div key={section.title}>
              <SectionTitle>{section.title}</SectionTitle>
              <LinkList>
                {section.items.map(item => (
                  <LinkItem key={item}>
                    <a href="#">{item}</a>
                  </LinkItem>
                ))}
              </LinkList>
            </div>
          ))}
          <div>
            <SectionTitle>Follow Us</SectionTitle>
            <SocialWrapper>
              {socialIcons.map(icon => (
                <SocialIcon href="#" key={icon.name} aria-label={icon.name}>
                  {icon.icon}
                </SocialIcon>
              ))}
            </SocialWrapper>
          </div>
        </Grid>
        <Copyright>
          <p>&copy; {year} DishGenie. All rights reserved.</p>
        </Copyright>
      </Container>
    </FooterWrapper>
  );
};

export default Footer;