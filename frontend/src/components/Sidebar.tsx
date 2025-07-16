import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
} from '@mui/material';
import {
  Dashboard,
  FolderOpen,
  UploadFile,
  Assessment,
  Quiz,
  PictureAsPdf,
  Settings,
} from '@mui/icons-material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';

const drawerWidth = 240;

interface SidebarItem {
  text: string;
  icon: React.ReactElement;
  path: string;
  divider?: boolean;
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const { projectId } = params;

  const mainItems: SidebarItem[] = [
    {
      text: 'Dashboard',
      icon: <Dashboard />,
      path: '/dashboard',
    },
  ];

  const projectItems: SidebarItem[] = projectId ? [
    {
      text: 'Project Overview',
      icon: <FolderOpen />,
      path: `/projects/${projectId}`,
      divider: true,
    },
    {
      text: 'Documents',
      icon: <UploadFile />,
      path: `/projects/${projectId}/documents`,
    },
    {
      text: 'Adjustments',
      icon: <Assessment />,
      path: `/projects/${projectId}/adjustments`,
    },
    {
      text: 'Questionnaires',
      icon: <Quiz />,
      path: `/projects/${projectId}/questionnaires`,
    },
    {
      text: 'Reports',
      icon: <PictureAsPdf />,
      path: `/projects/${projectId}/reports`,
    },
    {
      text: 'Settings',
      icon: <Settings />,
      path: `/projects/${projectId}/settings`,
    },
  ] : [];

  const handleItemClick = (path: string) => {
    navigate(path);
  };

  const isSelected = (path: string) => {
    return location.pathname === path;
  };

  const renderListItems = (items: SidebarItem[]) => {
    return items.map((item, index) => (
      <React.Fragment key={item.text}>
        {item.divider && index > 0 && <Divider sx={{ my: 1 }} />}
        <ListItem disablePadding>
          <ListItemButton
            selected={isSelected(item.path)}
            onClick={() => handleItemClick(item.path)}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                color: 'primary.contrastText',
                '&:hover': {
                  backgroundColor: 'primary.main',
                },
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: isSelected(item.path) ? 'primary.contrastText' : 'inherit',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        </ListItem>
      </React.Fragment>
    ));
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          top: 64, // Height of AppBar
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {renderListItems(mainItems)}
        </List>

        {projectId && (
          <>
            <Divider />
            <Box sx={{ p: 2, backgroundColor: 'grey.50' }}>
              <Typography variant="subtitle2" color="primary" fontWeight="bold">
                Project Workspace
              </Typography>
              <Typography variant="caption" color="textSecondary">
                Project ID: {projectId}
              </Typography>
            </Box>
            <List>
              {renderListItems(projectItems)}
            </List>
          </>
        )}
      </Box>
    </Drawer>
  );
};

export default Sidebar;