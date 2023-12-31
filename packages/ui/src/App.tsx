import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import useSession from './lib/hooks/useSession';
import Groups from './pages/groups';
import GroupsView from './pages/groups/view';
import Login from './pages/login';
import Register from './pages/register';
import { Toaster } from './components/ui';
import { PrivateWrapper, PublicWrapper } from './components/routes/protected-route';
import { useSelector } from 'react-redux';

function App() {
  const { loading, setLoading, setInitialSession } = useSession();

  const { isAuthenticated } = useSelector((state: any) => state.app);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) setInitialSession();
    else setLoading(false);
  }, []);

  return (
    <>
      {loading ? (
        <div className="h-full w-full flex items-center justify-center">Fetching session...</div>
      ) : (
        <BrowserRouter>
          <Toaster />
          <Routes>
            <Route path="/" element={<PublicWrapper auth={{ isAuthenticated }} />}>
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            <Route element={<PrivateWrapper auth={{ isAuthenticated }} />}>
              <Route path="/groups" element={<Groups />} />
              <Route path="/groups/:id" element={<GroupsView />} />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
