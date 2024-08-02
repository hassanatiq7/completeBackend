class apiResponse{
    constructor(
        statusCode,
        message = "Success",
        data,

    ) {
        this.data = data;
        this.statusCode = statusCode < 400;
        this.message = message;
        this.success = true;
    }
}