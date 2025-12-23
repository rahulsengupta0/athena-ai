import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import businessImg from '../../assets/bussiness.png';
import socialImg from '../../assets/socialMedia.png';
import youtubeImg from '../../assets/youtube.png';
import instaImg from '../../assets/insta.png';
import posterImg from '../../assets/poster.png';
import storyImg from '../../assets/story.png';

const categories = [
  { name: 'Business', path: '/templates/business', image: businessImg },
  { name: 'Social Media', path: '/templates/social-media', image: socialImg },
  { name: 'Youtube', path: '/templates/youtube', image: youtubeImg },
  { name: 'Instagram Post', path: '/templates/instagram-post', image: instaImg },
  { name: 'Poster', path: '/templates/poster', image: posterImg },
  { name: 'Story', path: '/templates/story', image: storyImg },
];

const CategoryCard = ({ category }) => {
  const [hover, setHover] = useState(false);

  const cardStyle = {
    display: 'block',
    border: '1px solid #ddd',
    borderRadius: '8px',
    overflow: 'hidden',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    transform: hover ? 'translateY(-5px)' : 'translateY(0)',
    boxShadow: hover ? '0 8px 16px rgba(0,0,0,0.1)' : 'none',
  };

  return (
    <Link
      to={category.path}
      style={cardStyle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <img src={category.image} alt={category.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
      <div style={{ padding: '1rem' }}>
        <h3>{category.name}</h3>
      </div>
    </Link>
  );
};

const TemplateCategories = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Explore Templates</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {categories.map((category) => (
          <CategoryCard key={category.name} category={category} />
        ))}
      </div>
    </div>
  );
};

export default TemplateCategories;
