import clienteAxios from "../config/axios";
import useSWR from "swr";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useAuth = ({middleware, url}) => {
    const token = localStorage.getItem('AUTH_TOKEN');
    const navigate = useNavigate();

    const { data: user, error, mutate } = useSWR('/api/user', () => 
        clienteAxios('/api/user', {
            headers: { 
                Authorization : `Bearer ${token}`
            }
        })
        .then(res => res.data)
        .catch(error => {
            throw Error(error?.response?.data?.errors)
        })
    );

    const login = async (datos, setErrores) => {
        try {
            const { data } = await clienteAxios.post('/api/login', datos);
            localStorage.setItem('AUTH_TOKEN', data.token);
            setErrores([]);
        } catch (error) {
            console.log(error);
            setErrores(Object.values(error.response.data.errors))
            await mutate()
        }
    }

    const registro = async (datos, setErrores) => {
        try {
            const { data } = await clienteAxios.post('/api/registro', datos);
            localStorage.setItem('AUTH_TOKEN', data.token);
            setErrores([])
            await mutate()
        } catch (error) {
            setErrores(Object.values(error.response.data.errors))
        }
    }

    const logout = async () => {
        //Revisar que no haya error, es decir, hay un usuario autenticado
        if (!error) { 
          await clienteAxios
            .post("/api/logout", null, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            })
            .then(() => {
              mutate(undefined); // Forzar la mutacion de SWR
              localStorage.removeItem("AUTH_TOKEN");// Eliminar el token
            })
            .catch(console.log);
        }
        window.location.pathname = "/auth/login"; //Redirigir
        // navigate("/auth/login");
      };


    useEffect(() => {
        if (user && middleware === "guest" && url) {
          navigate(url);
        }

        if(middleware === 'guest' && user && user.admin){
          navigate('/admin');
        }

        if(middleware === 'admin' && user && !user.admin){
          navigate('/');
        }

        if (middleware === "auth" && error) {
          logout();
        }
    }, [user, error]);

    return {
        login,
        registro,
        logout,
        user,
        error
    }
}