import React from 'react';
import { Link } from 'react-router-dom';
import businessImg from '../../assets/bussiness.PNG';
import socialImg from '../../assets/socialMedia.PNG';
import youtubeImg from '../../assets/youtube.PNG';
import instaImg from '../../assets/insta.PNG';
import posterImg from '../../assets/poster.PNG';

const categories = [
  { name: 'Business', path: '/templates/business', image: businessImg },
  { name: 'Social Media', path: '/templates/social-media', image: socialImg },
  { name: 'Youtube', path: '/templates/youtube', image: youtubeImg },
  { name: 'Instagram Post', path: '/templates/instagram-post', image: instaImg },
  { name: 'Poster', path: '/templates/poster', image: posterImg },
];

const TemplateCategories = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>Explore Templates</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {categories.map((category) => (
          <Link to={category.path} key={category.name} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div style={{ border: '1px solid #ddd', borderRadius: '8px', overflow: 'hidden' }}>
              <img src={category.image} alt={category.name} style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
              <div style={{ padding: '1rem' }}>
                <h3>{category.name}</h3>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TemplateCategories;
