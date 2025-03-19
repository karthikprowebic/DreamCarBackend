const getPagination = (page, size) => {
  const limit = size ? +size : 10;
  const offset = page ? (page - 1) * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, count, page, limit) => {
  const currentPage = page ? +page : 1;
  const totalPages = Math.ceil(count / limit);

  return {
    data,
    pagination: {
      total: count,
      page: currentPage,
      totalPages,
      pageSize: limit,
      hasMore: currentPage < totalPages,
    },
  };
};

module.exports = {
  getPagination,
  getPagingData,
};
