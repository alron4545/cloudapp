import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Assignments from './pages/Assignments.jsx'
import AssignmentDetail from './pages/AssignmentDetail.jsx'
import Photos from './pages/Photos.jsx'
import Other from './pages/Other.jsx'
import NotFound from './pages/NotFound.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="assignments" element={<Assignments />} />
        <Route path="assignments/:slug" element={<AssignmentDetail />} />
        <Route path="photos" element={<Photos />} />
        <Route path="other" element={<Other />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
