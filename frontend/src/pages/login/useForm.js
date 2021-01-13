import { useReducer } from "react";
import { makeStyles } from "@material-ui/core/styles";

const LoginFormStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
  },

  form__group: {
    "&:not(:last-child)": {
      marginBottom: "2rem",
    },
  },

  form__submit: {
    padding: "0.5rem",
  },

  form__mode: {
    textAlign: "center",
    fontSize: "1.1rem",
    fontWeight: "bold",
  },

  form__link: {
    color: theme.palette.primary.dark,
  },
}));

function useForm(initialValues) {
  const [formInput, setFormInput] = useReducer(
    (state, newState) => ({ ...state, ...newState }),
    initialValues
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formInput);
  };

  const handleInput = (e) => {
    const name = e.target.name;
    const newValue = e.target.value;
    setFormInput({ [name]: newValue });
  };

  return {
    formInput,
    setFormInput,
    handleInput,
    handleSubmit,
    styles: {
      LoginFormStyles,
    },
  };
}

export default useForm;
