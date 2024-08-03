class apiResponse{
    constructor(
        statusCode,
        message = "Success",
        data,

    ) {
        this.data = data;
        this.statusCode = statusCode;
        this.message = message;
        this.success = true;
    }
}

export { apiResponse }