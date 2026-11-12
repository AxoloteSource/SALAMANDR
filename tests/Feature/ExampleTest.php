<?php

namespace Tests\Feature;

use Tests\TestCase;

class ExampleTest extends TestCase
{
    public function test_returns_a_successful_response()
    {
        $response = $this->get('/');

        $response->assertOk();
    }
}
