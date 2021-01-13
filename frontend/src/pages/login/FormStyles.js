const UseFormStyles = (theme) => ({
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
});

export default UseFormStyles;
