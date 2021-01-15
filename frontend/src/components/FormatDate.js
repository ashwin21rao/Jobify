const FormatDate = function (date, locale = "en-GB", in_words = false) {
  let options = {};
  if (in_words)
    options = {
      year: "numeric",
      day: "numeric",
      month: "long",
    };
  return new Intl.DateTimeFormat(locale, options).format(date);
};

export default FormatDate;
