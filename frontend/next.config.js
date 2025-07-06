/** @type {import('next').NextConfig} */
const nextConfig = {
  // ビルド時のESLintチェックを無効にする (一時的、推奨はしない)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ビルド時のTypeScript型チェックを無効にする (一時的、推奨はしない)
  typescript: {
    ignoreBuildErrors: true,
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        // 環境変数 NEXT_PUBLIC_BACKEND_API_URL があればそれを使用
        // なければ http://localhost:8000 を使用 (開発環境向け)
        destination: `${process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000"}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;