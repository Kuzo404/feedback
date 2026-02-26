import React, { useState } from 'react';
import Layout from './components/Layout';
import SuperAdmin from './pages/SuperAdmin';
import BranchAdmin from './pages/BranchAdmin';
import DirectAdmin from './pages/DirectAdmin';
import Permissions from './pages/Permissions';
import Login from './pages/Login';
import { INITIAL_DATA, ROLES } from './data';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentRole, setCurrentRole] = useState(ROLES.SUPER_ADMIN);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [requests, setRequests] = useState(INITIAL_DATA);

  // --- ACTIONS ---

  // 1. Login Handler
  const handleLogin = (role) => {
    setCurrentRole(role);
    setIsLoggedIn(true);
    setActiveTab('dashboard'); // Нэвтрэх үед dashboard руу шилжүүлнэ
  };

  // 2. Logout Handler
  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentRole(ROLES.SUPER_ADMIN);
  };

  // 3. Салбар руу хуваарилах (Assign)
  const assignBranch = (id, branchName) => {
    setRequests(prev => prev.map(r => 
      r.id === id ? { 
        ...r, 
        branch: branchName, 
        status: 'Assigned', 
        assigned_at: new Date().toLocaleString() 
      } : r
    ));
  };

  // 4. Шууд шийдвэрлэж ИЛГЭЭХ (Send / Resolve)
  const handleSendRequest = (id, resolutionText) => {
    setRequests(prev => prev.map(r => 
      r.id === id ? { 
        ...r, 
        status: 'Assigned', 
        resolution: resolutionText, 
        resolved_at: null, 
        assigned_at: new Date().toLocaleString() 
      } : r
    ));
  };

  // --- CONTENT RENDERER ---
  const renderContent = () => {
    switch (currentRole) {
      case ROLES.SUPER_ADMIN:
        if (activeTab === 'permissions') return <Permissions />;
        return (
          <SuperAdmin 
            activeTab={activeTab} 
            requests={requests} 
            setRequests={setRequests} 
            assignBranch={assignBranch}
            handleSendRequest={handleSendRequest}
          />
        );
      
      case ROLES.BRANCH_ADMIN:
        return (
          <BranchAdmin 
            activeTab={activeTab} 
            requests={requests} 
            setRequests={setRequests} 
          />
        );
      
      case ROLES.DIRECT_ADMIN:
        return (
          <DirectAdmin 
            activeTab={activeTab} 
            requests={requests} 
            setRequests={setRequests} 
          />
        );
      
      default: return <div>Role not found</div>;
    }
  };

  // Хэрэв нэвтрээгүй бол LOGIN хуудсыг харуулна
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // --- МЭДЭГДЛИЙН ЛОГИК ---
  // Pending (Шинэ) болон Returned (Буцаагдсан) төлөвтэй хүсэлтүүдийг шүүж авна
  const notifications = requests.filter(r => r.status === 'Pending' || r.status === 'Returned');
  const pendingCount = notifications.length;

  return (
    <Layout 
      currentRole={currentRole} 
      setCurrentRole={setCurrentRole} 
      activeTab={activeTab} 
      setActiveTab={setActiveTab}
      pendingCount={pendingCount}
      notifications={notifications} // ШИНЭЭР НЭМСЭН: Жагсаалтыг дамжуулж байна
      onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
}