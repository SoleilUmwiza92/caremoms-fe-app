import React from 'react';
import '../styles/sidebar.css';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <h3>Community</h3>
        <div className="community-stats">
          <div className="stat-item">
            <span className="stat-number">1.2K</span>
            <span className="stat-label">Members</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">45</span>
            <span className="stat-label">Online</span>
          </div>
        </div>
      </div>

      <div className="sidebar-section">
        <h3>Quick Actions</h3>
        <button className="action-btn">
          <span className="btn-icon">📝</span>
          Create Post
        </button>
        <button className="action-btn">
          <span className="btn-icon">👥</span>
          Find Friends
        </button>
        <button className="action-btn">
          <span className="btn-icon">💬</span>
          Messages
        </button>
      </div>

{/*       <div className="sidebar-section"> */}
{/*         <h3>Topics</h3> */}
{/*         <div className="topic-tags"> */}
{/*           <span className="tag">#Pregnancy</span> */}
{/*           <span className="tag">#NewMom</span> */}
{/*           <span className="tag">#Toddler</span> */}
{/*           <span className="tag">#Health</span> */}
{/*           <span className="tag">#Nutrition</span> */}
{/*         </div> */}
{/*       </div> */}
    </aside>
  );
};

export default Sidebar;
