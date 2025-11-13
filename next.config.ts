import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    turbopack: {
        root: "./", // força o Next a considerar esta pasta como raiz
    },
};

export default nextConfig;
