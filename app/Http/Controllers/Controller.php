<?php

namespace App\Http\Controllers;
/**
 * @OA\Info(
 *    title="APIs For Thrift Store",
 *    version="1.0.0",
 * ),
 * @OA\Server(
 *      description="Learning env",
 *      url="https://localhost:8000/api/"
 *  ),
 *   @OA\SecurityScheme(
 *       securityScheme="bearerAuth",
 *       in="header",
 *       name="bearerAuth",
 *       type="http",
 *       scheme="bearer",
 *       bearerFormat="JWT",
 *    ),
 */
abstract class Controller
{
    //
}
