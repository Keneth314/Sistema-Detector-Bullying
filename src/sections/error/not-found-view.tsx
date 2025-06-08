import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';

import { isAuthenticated } from 'src/sections/auth/auth';

// ----------------------------------------------------------------------



export function NotFoundView() {
  const navigate = useNavigate();
  const handleGoHome = () => {
    if (isAuthenticated()) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <>
      <Logo sx={{ position: 'fixed', top: 20, left: 20 }} />

      <Container
        sx={{
          py: 10,
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h3" sx={{ mb: 2 }}>
          Lo sentimos, ¡página no encontrada!
        </Typography>

        <Typography sx={{ color: 'text.secondary', maxWidth: 480, textAlign: 'center' }}>
          Lo sentimos, no pudimos encontrar la página que buscas.
          ¿Quizás escribiste mal la URL? Revisa la ortografía.
        </Typography>

        <Box
          component="img"
          src={`${import.meta.env.BASE_URL}assets/illustrations/illustration-404.svg`}
          sx={{
            width: 320,
            height: 'auto',
            my: { xs: 5, sm: 4 },
          }}
        />

        <Button component={RouterLink} onClick={handleGoHome} size="large" variant="contained" color="inherit">
          Volver al inicio
        </Button>
      </Container>
    </>
  );
}
