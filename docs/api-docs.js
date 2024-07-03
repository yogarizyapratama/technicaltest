export default {
  "swagger": "2.0",
  "info": {
    "description": "This is the API documentation",
    "version": "1.0.0",
    "title": "Library API"
  },
  "host": "localhost:3002",
  "basePath": "/",
  "tags": [
    {
      "name": "books",
      "description": "Operations about books"
    },
    {
      "name": "members",
      "description": "Operations about members"
    }
  ],
  "paths": {
    "/api/books/borrow": {
      "post": {
        "tags": ["books"],
        "summary": "Borrow a book",
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "description": "Book and member details",
            "required": true,
            "schema": {
              "$ref": "#/definitions/BorrowBookRequest"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Book borrowed successfully"
          },
          "404": {
            "description": "Member or book not found"
          },
          "403": {
            "description": "Member is penalized"
          },
          "412": {
            "description": "Precondition failed"
          }
        }
      }
    },
    "/api/books/return": {
      "post": {
        "tags": ["books"],
        "summary": "Return a book",
        "parameters": [
          {
            "in": "body",
            "name": "body",
            "description": "Book and member details",
            "required": true,
            "schema": {
              "$ref": "#/definitions/ReturnBookRequest"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Book returned successfully"
          },
          "404": {
            "description": "Member or book not found"
          },
          "412": {
            "description": "Precondition failed"
          }
        }
      }
    },
    "/api/books/available": {
      "get": {
        "tags": ["books"],
        "summary": "Check available books",
        "responses": {
          "200": {
            "description": "List of available books"
          }
        }
      }
    },
    "/api/members": {
      "get": {
        "tags": ["members"],
        "summary": "Check members",
        "responses": {
          "200": {
            "description": "List of members and the number of books borrowed"
          }
        }
      }
    }
  },
  "definitions": {
    "BorrowBookRequest": {
      "type": "object",
      "properties": {
        "memberCode": {
          "type": "string"
        },
        "bookCode": {
          "type": "string"
        }
      }
    },
    "ReturnBookRequest": {
      "type": "object",
      "properties": {
        "memberCode": {
          "type": "string"
        },
        "bookCode": {
          "type": "string"
        }
      }
    }
  }
};
