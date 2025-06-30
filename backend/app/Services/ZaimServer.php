<?php

namespace App\Services;

use League\OAuth1\Client\Server\Server;
use League\OAuth1\Client\Credentials\TokenCredentials;
use League\OAuth1\Client\Credentials\TemporaryCredentials;

class ZaimServer extends Server
{
    /**
     * {@inheritDoc}
     */
    public function urlTemporaryCredentials()
    {
        return 'https://api.zaim.net/v2/auth/request';
    }

    /**
     * {@inheritDoc}
     */
    public function urlAuthorization()
    {
        return 'https://auth.zaim.net/users/auth';
    }

    /**
     * {@inheritDoc}
     */
    public function urlTokenCredentials()
    {
        return 'https://api.zaim.net/v2/auth/access';
    }

    /**
     * {@inheritDoc}
     */
    public function urlUserDetails()
    {
        return 'https://api.zaim.net/v2/home/user/verify';
    }

    /**
     * {@inheritDoc}
     */
    public function userDetails($data, TokenCredentials $tokenCredentials)
    {
        // Zaimのユーザー詳細情報を解析する処理
        // 今回は使用しないので空の配列を返す
        return [];
    }

    /**
     * {@inheritDoc}
     */
    public function userUid($data, TokenCredentials $tokenCredentials)
    {
        // Zaimのユーザーのユニークなidを返す処理
        // 今回は使用しないので空文字を返す
        return '';
    }

    /**
     * {@inheritDoc}
     */
    public function userEmail($data, TokenCredentials $tokenCredentials)
    {
        // Zaimのユーザーのメールアドレスを返す処理
        // 今回は使用しないので空文字を返す
        return '';
    }

    /**
     * {@inheritDoc}
     */
    public function userScreenName($data, TokenCredentials $tokenCredentials)
    {
        // Zaimのユーザーの表示名を返す処理
        // 今回は使用しないので空文字を返す
        return '';
    }
}
