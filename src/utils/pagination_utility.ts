export const paginated_query = (page: number, itemNo: number): { take?: number; skip?: number } => {
    let takeItem = itemNo || 10;

    let query: { take?: number; skip?: number } = {};
    if (page && takeItem) {
        query = { take: takeItem, skip: page * takeItem - takeItem };
    } else if (!page && takeItem) {
        query = { take: takeItem };
    }

    return query;
};

export const customPagination = (page: number, itemNo: number, data: Array<any>) => {
    if (isNaN(page)) page = 1;
    if (isNaN(itemNo)) itemNo = 10;

    return data.slice((page - 1) * itemNo, (page - 1) * itemNo + itemNo);
};

export const customOrderby = (data: Array<{ createdAt: Date }>) => {
    // desc
    return data.sort((date1, date2) => new Date(date2.createdAt).getTime() - new Date(date1.createdAt).getTime());
};
