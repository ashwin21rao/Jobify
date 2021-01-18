const FormatDate = function (
  date,
  show_time = false,
  in_words = false,
  locale = "en-GB"
) {
  let options = {};
  if (show_time) {
    options = {
      year: "numeric",
      day: "numeric",
      month: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
  }
  if (in_words)
    options = {
      year: "numeric",
      day: "numeric",
      month: "long",
    };
  return new Intl.DateTimeFormat(locale, options).format(date);
};

export default FormatDate;
