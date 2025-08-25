// src/layouts/DashboardLayout.jsx
import { Outlet } from 'react-router';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';
import SidebarFooter from '../components/layout/SidebarFooter';

export default function Layout() {
  return (
    <DashboardLayout slots={{ sidebarFooter: SidebarFooter }}>
      <PageContainer>
        <Outlet />
      </PageContainer>
    </DashboardLayout>
  );
}
