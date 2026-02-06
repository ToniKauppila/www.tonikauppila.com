module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addPassthroughCopy("style");
  eleventyConfig.addPassthroughCopy("scripts");
  eleventyConfig.addPassthroughCopy({ "*.json": "." });
  eleventyConfig.addPassthroughCopy(".htaccess");
  eleventyConfig.addPassthroughCopy("CNAME");

  return {
    dir: {
      input: "pages",
      output: "_site",
      includes: "_includes",
    },
    pathPrefix: "/",
    htmlOutputSuffix: "-o",
    templateFormats: ["njk", "html"],
    markdownTemplateEngine: "njk",
  };
};
