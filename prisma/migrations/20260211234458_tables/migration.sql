-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "pedido" TEXT NOT NULL,
    "observacoes" TEXT NOT NULL,
    "paymaent" TEXT NOT NULL,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);
