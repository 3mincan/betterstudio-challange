"use client";

import React, { useState, useEffect } from "react";
import Button from "./Button";
import { Log, LogsClientProps } from "../types/log";

const ITEMS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

const LogsClient = ({ initialLogs }: LogsClientProps) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [filter, setFilter] = useState({
    event: "",
    type: "",
    search: "",
    day: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setLogs(initialLogs);
    setCurrentPage(1);
    setIsLoading(false);
  }, [initialLogs]);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-UK", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const standardizeType = (type: string) => {
    return type.toUpperCase();
  };

  const filteredLogs = logs.filter((log) => {
    const matchesEvent = filter.event ? log.event === filter.event : true;
    const matchesType = filter.type
      ? standardizeType(log.type) === standardizeType(filter.type)
      : true;
    const matchesSearch = filter.search
      ? log.message.toLowerCase().includes(filter.search.toLowerCase())
      : true;
    const matchesDay = filter.day
      ? formatDate(log.timestamp) === filter.day
      : true;

    return matchesEvent && matchesType && matchesSearch && matchesDay;
  });

  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedLogs = filteredLogs.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const uniqueEvents = Array.from(new Set(logs.map((log) => log.event)));
  const uniqueTypes = Array.from(
    new Set(logs.map((log) => standardizeType(log.type)))
  ).sort();
  const uniqueDays = Array.from(
    new Set(logs.map((log) => formatDate(log.timestamp)))
  ).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-4 space-y-8">
        <div className="flex gap-4">
          <select
            className="border p-2 rounded"
            value={filter.event}
            onChange={(e) => setFilter({ ...filter, event: e.target.value })}
          >
            <option value="">All Events</option>
            {uniqueEvents.map((event) => (
              <option key={event} value={event}>
                {event}
              </option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={filter.type}
            onChange={(e) => setFilter({ ...filter, type: e.target.value })}
          >
            <option value="">All Types</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          <select
            className="border p-2 rounded"
            value={filter.day}
            onChange={(e) => setFilter({ ...filter, day: e.target.value })}
          >
            <option value="">All Days</option>
            {uniqueDays.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search in messages..."
            className="border p-2 rounded flex-1"
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        {paginatedLogs.map((log) => (
          <div
            key={log.id}
            className={`border p-2 rounded  ${
              standardizeType(log.type) === "ERROR"
                ? "bg-red-100 text-red-800"
                : standardizeType(log.type) === "WARN"
                ? "bg-yellow-100 text-yellow-800"
                : standardizeType(log.type) === "INFO"
                ? "bg-blue-100 text-blue-800"
                : standardizeType(log.type) === "DEBUG"
                ? "bg-purple-100 text-purple-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            <div className="flex justify-between text-sm text-gray-600">
              <span>{new Date(log.timestamp).toLocaleString("en-UK")}</span>
              <span className="px-2 py-1 rounded">
                {standardizeType(log.type)}
              </span>
            </div>
            <p className="mt-1">{log.message}</p>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex justify-center items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Items per page:</span>
            <select
              className="border p-2 rounded"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {ITEMS_PER_PAGE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="secondary"
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LogsClient;
