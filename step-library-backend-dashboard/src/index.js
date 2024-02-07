import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

import reportWebVitals from './reportWebVitals';
import RegisterPage from './RegisterPage';
import LibrarianPage from './LibrarianPage';
import TeacherPage from './TeacherPage';
import Profile from './Profile';
import EditPage from './EditPage';
import ViewDetail from './ViewDetail';
import GroupPage from './GroupPage';
import ViewGroup from './ViewGroup';
import App from './App';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import LoginPage from './LoginPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
    <Route path='/' element={<LoginPage></LoginPage>}/>
    <Route path='/' element= {<App></App>} errorElement={<h1>Not found!</h1>}>
      {/* <Route index element={} /> */}
      {/* librarain */}
      <Route path='librarianPage' element={<LibrarianPage></LibrarianPage>} />
      <Route path='librarianPage/profile' element={<Profile></Profile>} />
      <Route path='librarianPage/register' element={<RegisterPage></RegisterPage>} />
      <Route path='librarianPage/edit' element={<EditPage></EditPage>} />
      <Route path='librarianPage/viewDetail' element={<ViewDetail></ViewDetail>} />
      <Route path='librarianPage/group' element={ <GroupPage></GroupPage>} />

      {/* teacher */}
      <Route path='teacherPage' element={ <TeacherPage></TeacherPage>} />
      <Route path='teacherPage/profile' element={<Profile></Profile>} />
      <Route path='teacherPage/edit' element={<EditPage></EditPage>} />
      <Route path='teacherPage/viewGroup' element={<ViewGroup></ViewGroup>} />
    </Route>
    
    </>
  )
)
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router = {router}></RouterProvider> 
   {/* <App></App> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
