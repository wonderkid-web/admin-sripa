"use client";

import React from "react";
import { useMutation, useQuery } from "@apollo/client";
import { DELETE_TRANSACTION, GET_TRANSACTIONS } from "@/graphql";
import Loader from "./Loader";
import { ArrowBigDownDash, ArrowBigUpDash } from "lucide-react";
import { formatCurrency } from "@/helper";
import { toast } from "sonner";
import Image from "next/image";
import empty from "../../public/undraw_no_data_re_kwbl.svg";

function Transaction() {
  const { data, loading, error, refetch } = useQuery(GET_TRANSACTIONS);
  const [deleteFunction, { loading: loadingDelete, error: errorDelete }] =
    useMutation(DELETE_TRANSACTION);

  if (loading) return <Loader />;

  if (error) return <p>{error.message}</p>;

  if (!data?.transactions.length)
    return (
      <div className="flex justify-center items-center flex-col gap-3 ">
        <div className="size-32 relative overflow-hidden">
          <Image src={empty} alt="empty" fill objectFit="cover" sizes="full" />
        </div>
        <h1 className="text-2xl text-center text-carcoal font-medium">
          Belum Ada Transaksi
        </h1>
      </div>
    );

  return (
    <>
      {data?.transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="w-full h-fit rounded-sm border border-carcoal p-2 text-carcoal flex flex-col gap-2"
        >
          <div className="flex justify-between">
            <h1 className="text-lg font-bold">
              Type Transaksi: {transaction.type}
            </h1>
          </div>
          <div className="flex justify-between items-center">
            <p>Deskripsi</p>
            <p className="italic text-xs line-clamp-1">
              {transaction.keterangan}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p>Jenis Transaksi</p>
            <p className="italic text-xs flex items-center gap-1 my-1">
              {transaction.type == "DANA_MASUK" ? "Masuk" : "Keluar"}
              {transaction.type == "DANA_MASUK" ? (
                <ArrowBigDownDash strokeWidth={1} color="" />
              ) : (
                <ArrowBigUpDash strokeWidth={1} color="red" />
              )}
            </p>
          </div>
          <div className="flex justify-between items-center">
            <p>{formatCurrency(transaction.nominal)}</p>
            <p className="italic text-xs">{"Jum'at"}, 21 Desember 2024</p>
          </div>
          <button
            disabled={loadingDelete}
            className="flex justify-center gap-2 bg-red-400 rounded-sm px-2 py-1"
            onClick={async () => {
              try {
                await deleteFunction({
                  variables: {
                    id: transaction.id,
                  },
                });
                toast.success("Berhasil Menghapus Data");
                refetch();
              } catch (err: any) {
                toast.error(errorDelete?.message, {
                  description: JSON.stringify(err, null, 2),
                });
              }
            }}
          >
            <p className="text-white font-bold">Hapus</p>
          </button>
        </div>
      ))}
    </>
  );
}

export default Transaction;
